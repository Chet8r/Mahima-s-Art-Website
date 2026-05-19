import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { assertAdmin } from "@/lib/admin/guard";

/**
 * One-time helper: creates the two UK shipping rates in Stripe.
 * Call once (POST), copy the IDs into .env.local, then never call again.
 *
 *   STRIPE_SHIPPING_RATE_STANDARD=shr_...
 *   STRIPE_SHIPPING_RATE_EXPRESS=shr_...
 */
export async function POST() {
  try {
    await assertAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const standard = await stripe.shippingRates.create({
    display_name: "UK Standard Delivery (tracked, 2–5 working days)",
    type: "fixed_amount",
    fixed_amount: { amount: 800, currency: "gbp" },
    delivery_estimate: {
      minimum: { unit: "business_day", value: 2 },
      maximum: { unit: "business_day", value: 5 },
    },
  });

  const express = await stripe.shippingRates.create({
    display_name: "UK Express Delivery (signed for, next working day)",
    type: "fixed_amount",
    fixed_amount: { amount: 1200, currency: "gbp" },
    delivery_estimate: {
      minimum: { unit: "business_day", value: 1 },
      maximum: { unit: "business_day", value: 2 },
    },
  });

  return NextResponse.json({
    instructions: "Add these to .env.local, then redeploy on Vercel.",
    STRIPE_SHIPPING_RATE_STANDARD: standard.id,
    STRIPE_SHIPPING_RATE_EXPRESS: express.id,
  });
}
