import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  sendOrderConfirmation,
  sendArtistSaleNotification,
} from "@/lib/order-confirmation";

// Webhooks need the raw body for signature verification.
export const runtime = "nodejs";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET missing");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const body = await req.text();
  const h = await headers();
  const signature = h.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (e) {
    console.error("Stripe webhook signature failed", e);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  const db = supabaseAdmin();

  // Idempotency — if we've already processed this event, return 200 quietly.
  // PRIMARY KEY conflict means already processed.
  const { error: insertError } = await db
    .from("processed_webhooks")
    .insert({ event_id: event.id });
  if (insertError) {
    if (insertError.code === "23505") {
      // Duplicate — already processed.
      return NextResponse.json({ received: true, deduped: true });
    }
    console.error("Failed to record webhook", insertError);
    return NextResponse.json({ error: "Storage failure" }, { status: 500 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event.data.object);
    }
    // (Other event types are acknowledged with 200 but not processed.)
  } catch (e) {
    // If business logic fails, delete the dedupe row so Stripe's next
    // retry actually does the work — otherwise we'd silently swallow it.
    await db.from("processed_webhooks").delete().eq("event_id", event.id);
    console.error("Webhook handler failed", e);
    return NextResponse.json({ error: "Handler failure" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

type CheckoutSessionLite = {
  id: string;
  payment_intent?: string | { id: string } | null;
  payment_status?: string | null;
  amount_total?: number | null;
  customer_email?: string | null;
  customer_details?: {
    email?: string | null;
    name?: string | null;
    phone?: string | null;
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
  } | null;
  shipping_details?: {
    name?: string | null;
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
  } | null;
  shipping_cost?: {
    shipping_rate?: string | null;
  } | null;
  metadata?: { artwork_ids?: string } | null;
};

async function handleCheckoutCompleted(rawSession: unknown) {
  const session = rawSession as CheckoutSessionLite;
  if (session.payment_status !== "paid") {
    // Async payment methods (e.g. bank debit) may complete later via
    // a different event; ignore unpaid sessions here.
    return;
  }

  const artworkIds =
    session.metadata?.artwork_ids?.split(",").map((s) => s.trim()).filter(Boolean) ??
    [];
  if (artworkIds.length === 0) {
    console.warn(`Webhook for ${session.id} had no artwork_ids metadata`);
    return;
  }

  const db = supabaseAdmin();

  // Mark all paid artworks as sold (only if still available — defensive).
  const { data: updated, error: updateError } = await db
    .from("artworks")
    .update({ status: "sold" })
    .in("id", artworkIds)
    .eq("status", "available")
    .select(
      "id, title, price_pence, artwork_images(cloudinary_public_id, is_primary)"
    );

  if (updateError) {
    throw new Error(`Failed to mark sold: ${updateError.message}`);
  }

  // Invalidate the public-site caches so the homepage and detail pages
  // reflect the new "sold" status on the very next request. Without this
  // Vercel's Data Cache + CDN keep serving the previous render forever.
  revalidatePath("/", "layout");
  revalidatePath("/art/[slug]", "page");

  // Build the order confirmation payload.
  const buyerEmail =
    session.customer_email ?? session.customer_details?.email ?? null;
  if (!buyerEmail) {
    console.warn(`No buyer email for session ${session.id}, skipping email`);
    return;
  }

  const buyerName =
    session.shipping_details?.name ?? session.customer_details?.name ?? null;
  const buyerPhone = session.customer_details?.phone ?? null;

  const addr =
    session.shipping_details?.address ?? session.customer_details?.address;
  const shippingAddress = addr
    ? [
        buyerName,
        addr.line1,
        addr.line2,
        [addr.city, addr.postal_code].filter(Boolean).join(", ") || null,
        addr.country,
      ].filter((s): s is string => Boolean(s))
    : null;

  let shippingOption: string | null = null;
  const shippingRateId = session.shipping_cost?.shipping_rate;
  if (shippingRateId) {
    try {
      const rate = await stripe.shippingRates.retrieve(shippingRateId);
      shippingOption = rate.display_name ?? null;
    } catch {
      // non-fatal
    }
  }

  type UpdatedRow = {
    id: string;
    title: string;
    price_pence: number;
    artwork_images: { cloudinary_public_id: string; is_primary: boolean }[];
  };
  const rows = (updated ?? []) as UpdatedRow[];
  const artworks = rows.map((row) => {
    const primary =
      row.artwork_images.find((i) => i.is_primary) ?? row.artwork_images[0];
    return {
      title: row.title,
      pricePence: row.price_pence,
      imagePublicId: primary?.cloudinary_public_id ?? null,
    };
  });

  // Stripe's dashboard search resolves Payment Intent IDs (pi_...) but
  // not Checkout Session IDs (cs_...), so we prefer the PI for the order
  // reference. Fall back to the session ID if it's somehow missing.
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? session.id;

  const orderPayload = {
    buyerEmail,
    buyerName,
    buyerPhone,
    shippingAddress,
    shippingOption,
    amountPaidPence: session.amount_total ?? 0,
    paymentIntentId,
    artworks,
  };

  // Run both sends in parallel — the artist notification mustn't block
  // the buyer email if Resend is slow, and vice versa.
  await Promise.allSettled([
    sendOrderConfirmation(orderPayload),
    sendArtistSaleNotification(orderPayload),
  ]);
}
