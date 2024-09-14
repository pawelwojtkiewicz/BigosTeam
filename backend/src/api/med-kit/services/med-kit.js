'use strict';

/**
 * med-kit service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::med-kit.med-kit');
