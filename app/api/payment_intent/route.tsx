import { NextResponse } from "next/server";
import getServerStripe from "@/app/api/getServerStripe";

const stripe = getServerStripe();

// All item sold in stripe is in cents

const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Panda" }],
  [2, { priceInCents: 2000, name: "Dog" }],
]);

export async function POST(request: Request) {
  const {
    items,
    customerId,
  }: { items: [{ id: number; quantity: number }]; customerId: string } =
    await request.json();
  // Perform validation here to make sure the format is correct
  // .....

  // Create exactly one PaymentIntent for each order or customer session in your system
  // We only need to calculate TOTAL payment amount instead of amount of items needed
  const totalAmount = items
    .map((item) => storeItems.get(item.id)?.priceInCents! * item.quantity)
    .reduce(function (a, b) {
      return a + b;
    });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency: "hkd",
    automatic_payment_methods: { enabled: true },
    description: `${customerId}-Welcome to buy something I guess....`,
    metadata: { customerId },
  });
  // Save payment intent in DB

  // It returns client secret (used to complete a payment from your frontend)
  // ENABLE TLS!!!!!!!!
  return NextResponse.json({
    id: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentIntentId = searchParams.get("paymentIntentId");

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  return NextResponse.json(paymentIntent);
}
