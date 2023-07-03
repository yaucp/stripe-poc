'use client'
import { loadStripe, Stripe } from '@stripe/stripe-js'


let stripePromise: Promise<Stripe | null> | null = null

/**
 * Returns a stripe promise that is used in the CLIENT side only.
 * @return StripePromise {Promise<Stripe | null> | null}
 */
export default function getClientStripePromise() {
  if (stripePromise === null) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUB_KEY!)
  }
  return stripePromise
}
