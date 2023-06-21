const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); //Put Stripe secret key only in our remote service
function getServerStripe() {
  return stripe;
}

export default getServerStripe;
