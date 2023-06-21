import { NextResponse } from "next/server";
import getServerStripe from "@/app/api/getServerStripe";
import { PaymentIntent } from "@stripe/stripe-js";

const stripe = getServerStripe();

export async function POST(request: Request) {
  const {
    paymentIntentId,
    discount,
  }: { paymentIntentId: string; discount: string } = await request.json();
  // Perform validation here to make sure the format is correct
  // .....

  if (discount !== "123") {
    return new Response("lmao", {
      status: 406,
    });
  }

  // Update the intent with new amount/other parameters
  const updatedIntent: PaymentIntent = await stripe.paymentIntents.update(
    paymentIntentId,
    {
      amount: 10000,
    }
  );
  // Save payment intent in DB

  return NextResponse.json({
    status: updatedIntent.status,
    amount: updatedIntent.amount,
  });
}
