"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Stripe } from "@stripe/stripe-js";
import getClientStripePromise from "@lib/getClientStripe";
import useSWR from "swr";
import SessionSuccess from "@/app/success/SessionSuccess";

export default async function Success() {
  const params = useSearchParams();
  const session_id = params.get("session_id")!;
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


  stripe = await getClientStripePromise();

  if (typeof session_id === 'string' && session_id !== '') {
    return (
        <SessionSuccess session_id={session_id}></SessionSuccess>
    );
  }
  return (
    <main>
      <div className="p-4">
        <h1>Success landing page!</h1>
      </div>
    </main>
  );
}
