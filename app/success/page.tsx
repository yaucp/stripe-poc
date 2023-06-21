"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import getStripe from "@/helpers/getStripe";
import { Stripe } from "@stripe/stripe-js";

export default async function Success() {
  const params = useSearchParams();
  const session_id = params.get("session_id")!;
  const [data, setData] = useState("");
  // const stripe = useStripe()
  let stripe: Stripe | null = null;

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent!.status) {
        case "succeeded":
          alert("Payment succeeded!");
          break;
        case "processing":
          alert("Your payment is processing.");
          break;
        case "requires_payment_method":
          alert("Your payment was not successful, please try again.");
          break;
        default:
          alert("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  useEffect(() => {
    if (session_id) {
      fetch(`/api/success?session_id=${session_id}`)
        .then((res) => res.json())
        .then((json) => {
          setData(json.customer_details.name);
          console.log(json.customer_details.name);
        });
    }
  }, []);

  stripe = await getStripe();
  return (
    <main>
      <div className="p-4">
        <h1>Landing page!</h1>
        <h2>{session_id && <span>Simple Checkout Success! Your name is {data}</span>}</h2>
      </div>
    </main>
  );
}
