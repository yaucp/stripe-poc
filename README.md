This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

The purpose is to provide a brief look into how stripe checkout session and payment intent/payment elements works.

## Getting Started

### Get Stripe API Info

Before starting the development server, please create a stripe account and obtain your stripe api public and secret key. In this repo, I have attached `.env.example` for you to take reference of what to include in the environment variables.

Rename `.env.example` to `.env.local` and put your API test public and secret from your stripe's dashboard. If you are changing your base url, please update it as well.

This repo also demostrates a VERY BASIC webhook. If you are not using webhook secret, ignore it. See [how to create webhook secret here](https://stripe.com/docs/webhooks/signatures)

### Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Basic Walkthrough

The API is designed to be RESTful for clearer understanding.

Checkout session is used only when you require a low code solution and do not mind using Stripe's own prebuilt checkout page. It only requires the developer to create the checkout session and send back the prebuilt checkout's page url to the client so that the client could redirect to it directly. Stripe handles the payment process by itself. After payment confirmed/succeeded, it would redirect the user to the url that you provided when you created the checkout session. You can then use the client side SDK to obtain relevant info and use webhook to properly update your DB.
