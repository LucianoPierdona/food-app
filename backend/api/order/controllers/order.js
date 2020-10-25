"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const stripe = require("stripe")(
  "sk_test_51HgCkFDCMYi99bcVx8Sb3iJIJbBIXYLI1gE1cjdQ0pjJ3rOdYtsBkPot4cWnAYerkd6jx8ukTcYpTuIDkUiYM8iG00MljT7DBv"
);

module.exports = {
  create: async (ctx) => {
    const { address, amount, dishes, token, city, state } = JSON.parse(
      ctx.request.body
    );
    const stripeAmount = Math.floor(amount * 100);
    const charge = await stripe.charges.create({
      amount: stripeAmount,
      currency: "usd",
      description: `Order ${new Date()} by ${ctx.state.user.email}`,
      source: token,
    });

    // Register The order in the database
    const order = await strapi.services.order.create({
      user: ctx.state.user.id,
      charge_id: charge.id,
      amount: stripeAmount,
      address,
      dishes,
      city,
      state,
    });

    return order;
  },
};
