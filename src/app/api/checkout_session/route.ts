import { NextResponse } from 'next/server'
import getServerStripe from '@lib/getServerStripe'


const stripe = getServerStripe()

// All item sold in stripe is in cents
const storeItems = new Map([
    [ 1, { priceInCents: 10000, name: 'Panda' } ],
    [ 2, { priceInCents: 2000, name: 'Dog' } ]
])

// Use POST to CREATE checkout session
export async function POST(request: Request) {
    const { items }: { items: [{ id: number; quantity: number }] } =
        await request.json()
    // Maybe also pass in locale as well?
    // Perform validation here to make sure the format is correct
    // .....

    // Create checkout checkout-session
    const session = await stripe.checkout.sessions.create({
        line_items: items.map((item) => {
            const itemData = storeItems.get(item.id)
            return {
                price_data: {
                    currency: 'hkd',
                    product_data: {
                        name: itemData!.name
                    },
                    unit_amount: itemData!.priceInCents
                },
                quantity: item.quantity
            }
        }),
        payment_method_types: [ 'card', 'alipay', 'wechat_pay' ],
        payment_method_options: {
            wechat_pay: {
                // WeChat pay requires declaration on what platform to use
                client: 'web'
            }
        },
        mode: 'payment',
        // stripe automatically fills in the checkout checkout-session id
        success_url: `http://${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://${process.env.CLIENT_URL}/failed`
    })

    return NextResponse.json(session)
}

// Use GET to retrieve checkout session from session id
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    console.log("obtained session id", sessionId)
    if (sessionId === null) {
        return new NextResponse('no session id huhhhhh', { status: 400 })
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    console.log("received response")
    return NextResponse.json(session)
}

