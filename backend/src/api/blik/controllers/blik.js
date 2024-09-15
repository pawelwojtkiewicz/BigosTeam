"use strict";

/**
 * A set of functions called "actions" for `blik`
 */
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::blik.blik", ({ strapi }) => ({
  async makeDonation(ctx) {
    const { amount, payMethodValue } = ctx.request.body;

    try {
      if (!amount || !payMethodValue) {
        return ctx.badRequest("params are missing!");
      }

      const result = await strapi
        .service("api::blik.blik")
        .makeDonation(ctx);
      return result;
    } catch (error) {
      strapi.log.error("Error in makeDonation controller:", error);
      return ctx.internalServerError(error.message);
    }
  },
}));
