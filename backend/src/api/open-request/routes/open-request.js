'use strict';

/**
 * open-request router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::open-request.open-request');
