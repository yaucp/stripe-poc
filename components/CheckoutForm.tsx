"use client";

import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";

const CheckoutForm = ({
  clientSecret,
  paymentIntentId,
}: {
  clientSecret: string;
  paymentIntentId: string;
}) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [dogDetailValidated, setDetailValidated] = useState(false);

  // Access stripe/elements with these 2 hooks
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (stripe === null) {
      return;
    }
    const getAmount = async () => {
      const intent = await stripe.retrievePaymentIntent(clientSecret);
      if (intent.error) {
        alert(intent.error.message);
        return;
      }
      setPrice(intent.paymentIntent.amount);
    };
    getAmount();
  }, [stripe]);

  // Customizations here: https://stripe.com/docs/payments/payment-element
  // https://stripe.com/docs/js/elements_object/create_payment_element#payment_element_create-options-layout-defaultCollapsed
  // https://stripe.com/docs/elements/appearance-api variables (detailed customizations again.....)
  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
    business: { name: "Eat shit business" },
    paymentMethodOrder: [
      "apple_pay",
      "google_pay",
      "card",
      "alipay",
      "wechat_pay",
    ],
  };

  // Can update paymentIntent after collecting discount codes, in other fields....
  // https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=elements&client=react#fetch-updates
  async function applyDiscount() {
    setIsLoading(true);
    fetch("/api/update_intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //     Add some verification here ofc!
      },
      body: JSON.stringify({
        paymentIntentId,
        discount: "123",
      }),
    })
      .then(async (res) => {
        if (res.ok) {
          // With good status
          return res.json();
        } else {
          return res.json().then((json) => Promise.reject(json));
        }
      })
      .then(async (data) => {
        if (data.status === "requires_payment_method") {
          setMessage("Applied Discount!");
          await elements?.fetchUpdates();
          setPrice(data.amount);
        } else Promise.reject(data);
      })
      .catch((e) => {
        console.log(e);
      });
    setIsLoading(false);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Add a function here to submit/validate the dog name and upload the image first.
    // or add a button next to 2 inputs and require them to be validated first
    if (dogDetailValidated === false) {
      alert("Please upload your images and dog name first");
      return;
    }

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000/success",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message!);
    } else {
        console.log(error)
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  function validateDog() {
    setDetailValidated((e) => !e);
    setMessage("Verified Dog Stuff!");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="ml-auto">Price is {price / 100}</div>
      <br />
      <br />
      Dogs Name:{" "}
      <input
        className="border border-gray-600 border-2 rounded ml-auto p-2"
        type="text"
      />
      <br />
      Upload Image:{" "}
      <input type="file" name="myImage" accept="image/png, image/jpeg" />
      <br />
      <button
        type="button"
        className="border border-gray-600 border-2 rounded ml-auto p-2"
        onClick={validateDog}
        id="dogDetails"
      >
        Validated dog stuff
      </button>
      <br />
      <button
        type="button"
        className="border border-gray-600 border-2 rounded ml-auto p-2"
        onClick={applyDiscount}
        id="discount"
      >
        Apply fake discount
      </button>
      {/*embedded via iframe*/}
      {message && (
        <div id="payment-message" className="text-red-600">
          {message}
        </div>
      )}
      <PaymentElement options={paymentElementOptions} />
      <input
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="border border-gray-600 border-2 rounded"
        id="submit"
        value="Pay"
      />
    </form>
  );
};

export default CheckoutForm;
