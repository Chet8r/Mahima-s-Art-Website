import "server-only";
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

export const stripe = new Stripe(key, {
  // Pin a stable API version so behaviour doesn't change underneath us.
  apiVersion: "2026-04-22.dahlia",
  typescript: true,
});

export const SHIPPING_RATE_IDS = {
  standard: process.env.STRIPE_SHIPPING_RATE_STANDARD,
  express: process.env.STRIPE_SHIPPING_RATE_EXPRESS,
};
