'use strict';

/**
 * product controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::product.product', ({ strapi }) => ({
  async findEquippedWithMedKits(ctx) {
    const productId = ctx.params.productId;
    const sanitizedQuery = await this.sanitizeQuery(ctx);

    if (!sanitizedQuery.lat || !sanitizedQuery.long) {
      return ctx.badRequest('Coordinates are missing!');
    }

    const result = await strapi.service('api::product.product').findEquippedWithMedKits({...sanitizedQuery, productId});
    const { entities } = await this.sanitizeOutput(result, ctx);

    return this.transformResponse(entities);
  }
}));
