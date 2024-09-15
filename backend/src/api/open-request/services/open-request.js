'use strict';

/**
 * open-request service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::open-request.open-request');
