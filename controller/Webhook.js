const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Stripe = require("stripe");
const UserSubscription = require("../models/UserSubscription"); // Update the path as needed

const stripe = Stripe(process.env.STRIPE_API_KEY);

// Stripe requires the raw body to construct the event
exports.webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Extract the object from the event.
  const data = event.data.object;

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = data;
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );

    // Ensure we have the userId in metadata before proceeding
    if (!session.metadata || !session.metadata.userId) {
      return res.status(400).send("User id is required");
    }

    // Here, you should update your database with the new subscription info
    await UserSubscription.create({
      userId: session.metadata.userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });
  }

  // Handle the invoice.payment_succeeded event
  if (event.type === "invoice.payment_succeeded") {
    const session = data;
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription
    );

    // Update the subscription with the new details
    await UserSubscription.updateOne(
      { stripeSubscriptionId: subscription.id },
      {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      }
    );
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).send("Received");
};
