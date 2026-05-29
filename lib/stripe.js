import Stripe from "stripe";

// Singleton del cliente Stripe (solo servidor)
let _stripe;

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    });
  }
  return _stripe;
}

// IDs de precios en Stripe (configurar en .env.local)
export const STRIPE_PRICES = {
  month:    process.env.STRIPE_PRICE_MONTHLY,
  halfyear: process.env.STRIPE_PRICE_HALFYEAR,
  year:     process.env.STRIPE_PRICE_YEARLY,
};
