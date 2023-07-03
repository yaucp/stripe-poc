import { NextResponse } from 'next/server'
import getServerStripe from '@lib/getServerStripe'


const stripe = getServerStripe()

// All item sold in stripe is in cents

const storeItems = new Map([
  [ 1, { priceInCents: 10000, name: 'Panda' } ],
  [ 2, { priceInCents: 2000, name: 'Dog' } ]
])

export async function POST(request: Request) {
  const {
    items,
    customerId
  }: { items: [{ id: number; quantity: number }]; customerId: string } =
      await request.json()
  // Perform validation here to make sure the format is correct
  // .....

  // Create exactly one PaymentIntent for each order or customer session in your system
  // We only need to calculate TOTAL payment amount instead of amount of items needed
  // Fetch pricing from DB here!
  const totalAmount = items
      .map((item) => storeItems.get(item.id)?.priceInCents ?? 10000 * item.quantity)
      .reduce(function (a, b) {
        return a + b
      })

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency: 'hkd',
    automatic_payment_methods: { enabled: true },
    description: `${customerId}-Welcome to buy something I guess....`,
    metadata: { customerId }
  })
  // Save payment intent in DB

  // It returns client secret (used to complete a payment from your frontend)
  // ENABLE TLS!!!!!!!!
  return NextResponse.json({
    id: paymentIntent.id,
    clientSecret: paymentIntent.client_secret
  })
}

// Just gets the payment intent object from the payment intent id
// Can get info like amount to display the details in FE
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const paymentIntentId = searchParams.get('paymentIntentId')

  if (typeof paymentIntentId === 'string') {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return NextResponse.json(paymentIntent)
  }

  // no payment intent RIP
  // throw bad request error here thanks
  return new NextResponse('no payment intent lah bruv', { status: 400 })
}

// To update payment intent (amount? name? ....)
// https://stripe.com/docs/api/payment_intents/update
export async function PATCH(request: Request) {
  const {
    paymentIntentId,
    discount
  }: { paymentIntentId: string; discount: string } = await request.json()
  // Perform validation here to make sure the format is correct
  // .....

  if (discount !== '123') {
    return new Response('lmao', {
      status: 406
    })
  }

  // Update the intent with new amount/other parameters
  const updatedIntent = await stripe.paymentIntents.update(
      paymentIntentId,
      {
        amount: 10000
      }
  )
  // Save new payment intent in DB
  // Or verify

  return NextResponse.json({
    status: updatedIntent.status,
    amount: updatedIntent.amount
  })
}
