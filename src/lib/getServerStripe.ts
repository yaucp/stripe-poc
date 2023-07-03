import 'server-only'
import Stripe from 'stripe'


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' })

/**
 * Return stripe that is used in server api route only!
 */
export default function getServerStripe() {
    return stripe
}
