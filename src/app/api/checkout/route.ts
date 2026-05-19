import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe, SHIPPING_RATE_IDS } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabase/server";

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

function publicImageUrl(publicId: string): string | undefined {
  if (!publicId) return undefined;
  if (publicId.startsWith("placeholder/")) {
    const seed = publicId.replace("placeholder/", "");
    return `https://picsum.photos/seed/${seed}/800/1000`;
  }
  if (!CLOUDINARY_CLOUD) return undefined;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/c_fill,w_800,h_1000,f_auto,q_auto/${publicId}`;
}

type CartLine = {
  id: string;
  slug: string;
};

type DbRow = {
  id: string;
  slug: string;
  title: string;
  price_pence: number;
  status: "available" | "reserved" | "sold";
  is_published: boolean;
  artwork_images: { cloudinary_public_id: string; is_primary: boolean }[];
};

export async function POST(req: Request) {
  if (!SHIPPING_RATE_IDS.standard || !SHIPPING_RATE_IDS.express) {
    return NextResponse.json(
      {
        error:
          "Shipping rates not configured. Admin must POST /api/admin/stripe-shipping-setup once.",
      },
      { status: 500 }
    );
  }

  let body: { items?: CartLine[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Basket is empty." }, { status: 400 });
  }

  const ids = [...new Set(items.map((i) => i.id))].slice(0, 50);
  if (ids.length === 0) {
    return NextResponse.json({ error: "Basket is empty." }, { status: 400 });
  }

  // Re-fetch every item server-side. Never trust the client price/title —
  // a malicious cart could try to pay £0.01 for a £500 painting.
  const { data, error } = await supabaseServer
    .from("artworks")
    .select(
      "id, slug, title, price_pence, status, is_published, artwork_images(cloudinary_public_id, is_primary)"
    )
    .in("id", ids);

  if (error) {
    console.error("Checkout DB fetch failed", error);
    return NextResponse.json(
      { error: "Couldn't load basket." },
      { status: 500 }
    );
  }

  const rows = (data ?? []) as DbRow[];

  const unavailable = ids
    .map((id) => {
      const row = rows.find((r) => r.id === id);
      if (!row) return { id, reason: "removed" as const };
      if (!row.is_published) return { id, reason: "removed" as const };
      if (row.status !== "available")
        return { id, reason: row.status as "reserved" | "sold" };
      return null;
    })
    .filter((x): x is { id: string; reason: "removed" | "reserved" | "sold" } => !!x);

  if (unavailable.length > 0) {
    return NextResponse.json(
      {
        error: "Some items are no longer available.",
        unavailable,
      },
      { status: 409 }
    );
  }

  const lineItems = rows.map((row) => {
    const primary =
      row.artwork_images.find((i) => i.is_primary) ?? row.artwork_images[0];
    const image = primary
      ? publicImageUrl(primary.cloudinary_public_id)
      : undefined;
    return {
      quantity: 1,
      price_data: {
        currency: "gbp",
        unit_amount: row.price_pence,
        product_data: {
          name: row.title,
          metadata: { artwork_id: row.id, slug: row.slug },
          ...(image ? { images: [image] } : {}),
        },
      },
    };
  });

  const h = await headers();
  const origin =
    h.get("origin") ||
    (h.get("host")
      ? `${h.get("x-forwarded-proto") || "https"}://${h.get("host")}`
      : "http://localhost:3000");

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "gbp",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["GB"] },
      shipping_options: [
        { shipping_rate: SHIPPING_RATE_IDS.standard! },
        { shipping_rate: SHIPPING_RATE_IDS.express! },
      ],
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      allow_promotion_codes: false,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        artwork_ids: rows.map((r) => r.id).join(","),
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe didn't return a URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Stripe session create failed", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: `Couldn't start checkout: ${msg}` },
      { status: 500 }
    );
  }
}
