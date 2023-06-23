import {NextResponse} from "next/server";
import getServerStripe from "@/app/api/getServerStripe";
import Stripe from "stripe";

const stripe = getServerStripe();
const webhookSecret = process.env.WEBHOOK_SECRET

export async function POST(request: Request) {
    let event:  Stripe.Event

    // Only verify the event if you have an endpoint secret defined.
    // Otherwise, use the basic event deserialized with JSON.parse
    if (webhookSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers.get('stripe-signature');
        try {
            event = stripe.webhooks.constructEvent(
                await request.text(),
                signature,
                webhookSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err);
            return new NextResponse('',{status: 400});
        }
    } else {
        console.log("no stripe webhook set!")
        return new NextResponse('',{status: 400});
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = <Stripe.PaymentIntent>event.data.object;
          console.log(
            `PaymentIntent for ${paymentIntent.id} with amount ${paymentIntent.amount}  was successful!`
          );
          // Then define and call a method to handle the successful payment intent.
          // handlePaymentIntentSucceeded(paymentIntent);
          break;
        }
        case 'payment_intent.canceled': {
            const paymentIntent = <Stripe.PaymentIntent>event.data.object;
            console.log(`paymentIntent for ${paymentIntent.id} with amount ${paymentIntent.amount} canceled`);
            break;
        }
        case 'payment_intent.processing': {
            const paymentIntent = <Stripe.PaymentIntent>event.data.object;
            console.log(`paymentIntent for ${paymentIntent.id} with amount ${paymentIntent.amount} processing`);
            break;
        }
        case 'payment_intent.payment_failed': {
            const paymentIntent = <Stripe.PaymentIntent>event.data.object;
            console.log(`paymentIntent for ${paymentIntent.id} with amount ${paymentIntent.amount} failed fuckkkk!`);
            break;
        }
        case 'payment_method.attached': {
          const paymentMethod = event.data.object;
          // Then define and call a method to handle the successful attachment of a PaymentMethod.
          // handlePaymentMethodAttached(paymentMethod);
          console.log("attached payments");
          break;
        }
        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
    }
    return new NextResponse('',{status: 200});
}
