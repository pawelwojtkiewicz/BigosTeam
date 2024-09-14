'use strict';

/**
 * supply router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::supply.supply');
