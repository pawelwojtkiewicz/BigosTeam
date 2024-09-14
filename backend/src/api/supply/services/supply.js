'use strict';

/**
 * supply service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::supply.supply');
