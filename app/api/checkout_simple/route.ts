import {NextResponse} from "next/server"
import {Stripe} from "@stripe/stripe-js"
import getServerStripe from "@/app/api/getServerStripe";

// All item sold in stripe is in cents

const storeItems = new Map([
    [1, { priceInCents: 10000, name: "Burn" }],
    [2, { priceInCents: 2000, name: "Sleep"}]
])
const stripe = getServerStripe()
export async function POST(request: Request){
    const {items}: {items: [{id: number, quantity: number}]} = await request.json()
    // Perform validation here to make sure the format is correct
    // .....

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
        line_items:
            items.map(item => {
                const itemData = storeItems.get(item.id)
                return {
                    price_data: {
                        currency: 'hkd',
                        product_data:
                            {
                                name: itemData!.name,
                            },
                        unit_amount: itemData!.priceInCents,
                    },
                    quantity: item.quantity,
                }
            })
        ,
        payment_method_types:['card'],
        mode: 'payment',
        success_url: `http://${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://${process.env.CLIENT_URL}/cancel`,
    });

    return NextResponse.json(session)
}
