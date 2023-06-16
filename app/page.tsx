'use client'

import Stripe from "stripe";
import { useRouter } from 'next/navigation'


export default function Home() {
    const router = useRouter()

    function simpleCheckout() {
        fetch("/api/checkout_simple", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: [
              { id: 1, quantity: 3 },
              { id: 2, quantity: 1 },
            ],
          }),
        })
          .then((res) => {
            if (res.ok) return res.json();
            return res.json().then((json) => Promise.reject(json));
          })
          .then((session: Stripe.Checkout.Session) => {
            alert(session.url);
            console.log(session.url);
            router.push(session.url!)
          })
          .catch((e) => {
            console.log("FKINGGG ERORR");
              console.log(e)
            alert(e);
          });
    }

    return (
        <main>
            <div className="p-4">
                <h1>
                    Simple Pre-built Checkout
                </h1>
                <h3>
                    Buying 2 item with id=1 and 1 item with id=2
                </h3>
                <span>

                </span>
                <button
                    onClick={simpleCheckout}
                    className="border border-gray-600 border-2"
                >
                    Checkout
                </button>
            </div>
        </main>
    )
}
