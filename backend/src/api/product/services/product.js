'use strict';

/**
 * product service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const haversine = require('haversine');

module.exports = createCoreService('api::product.product', ({ strapi }) => ({
  async findEquippedWithMedKits(ctx) {
    const { productId, lat, long, distance = 50 } = ctx;

    const supplies = await strapi.entityService.findMany('api::supply.supply', {
      populate: ['medKit'],
      filters: {
        product: {
          id: {
            $eq: +productId
          }
        }
      }
    });

    /** @type {Record<number, Record<string, unknown>>} */
    const medKits = {};
    let iter = 0;
    let medKitId;
    let currentDistance;

    for (iter; iter < supplies.length; iter++) {
      medKitId = supplies[iter].medKit.id;

      if (medKitId in medKits) {
        continue;
      }

      currentDistance = haversine(
        [parseFloat(lat), parseFloat(long)],
        [parseFloat(supplies[iter].medKit.lat), parseFloat(supplies[iter].medKit.long)],
        {
          format: '[lat,lon]',
          unit: 'meter'
        }
      );

      if (currentDistance < distance) {
        medKits[medKitId] = supplies[iter].medKit;
      }
    }

    return { entities: Object.values(medKits) };
  }
}));
