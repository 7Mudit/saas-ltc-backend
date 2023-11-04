const UserSubscription = require("../models/UserSubscription");

const DAY_IN_MS = 86_400_400;

exports.checkSubscription = async (userId) => {
  try {
    if (!userId) {
      return false;
    }

    // Await the result of the findOne operation
    const userSubscription = await UserSubscription.findOne({
      userId: userId,
    }).select(
      "stripeSubscriptionId stripeCurrentPeriodEnd stripeCustomerId stripePriceId"
    );

    // Check if the userSubscription actually exists
    if (!userSubscription) {
      return false;
    }

    // Check if the subscription is valid
    const isValid = userSubscription.stripePriceId &&
      new Date(userSubscription.stripeCurrentPeriodEnd).getTime() + DAY_IN_MS > Date.now();

    return !!isValid;
  } catch (err) {
    console.log(err);
    return false; // Return false if there was an error processing the request
  }
};
