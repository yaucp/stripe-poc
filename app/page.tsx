"use client";

import Stripe from "stripe";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

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
        router.push(session.url!);
      })
      .catch((e) => {
        console.log("FKINGGG ERORR");
        console.log(e);
        alert(e);
      });
  }

  function customCheckout() {
    router.push("/custom_checkout");
  }

  return (
    <main>
      <div className="p-4">
        <div className="m-1 p-3 border border-gray-600 rounded">
          <h1>Simple Pre-built Checkout</h1>
          <h3>Buying 2 item with id=1 and 1 item with id=2</h3>
          <span></span>
          <button
            onClick={simpleCheckout}
            className="border border-gray-600 border-2 rounded"
          >
            Checkout
          </button>
        </div>
        <div className="m-1 p-3 border border-gray-600 rounded">
          <h1>Custom Checkout with Stripe Elements</h1>
          <h2>
            This confirm payment button should be placed on the page where the
            user confirm what they are buying.
          </h2>
          <h2>
            It creates a payment intent and returns a client secret (that will
            be used in the final checkout page
          </h2>
          <button
            className="border border-gray-600 border-2 rounded"
            onClick={customCheckout}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </main>
  );
}
