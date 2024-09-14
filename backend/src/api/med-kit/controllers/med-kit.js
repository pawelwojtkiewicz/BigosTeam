'use strict';

/**
 * med-kit controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::med-kit.med-kit', ({ strapi }) => ({
	async findClosest(ctx) {
	  const sanitizedQuery = await this.sanitizeQuery(ctx);
  
	  if (!sanitizedQuery.lat || !sanitizedQuery.long) {
		return ctx.badRequest('Coordinates are missing!');
	  }
  
	  const result = await strapi.service('api::med-kit.med-kit').findClosest(sanitizedQuery);
	  const { entity, meta } = await this.sanitizeOutput(result, ctx);
	  return this.transformResponse(entity, meta);
	}
  }));
