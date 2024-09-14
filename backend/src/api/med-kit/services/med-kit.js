'use strict';

/**
 * med-kit service
 */

const { createCoreService } = require('@strapi/strapi').factories;
const haversine = require('haversine');

module.exports = createCoreService('api::med-kit.med-kit', ({ strapi }) => ({
	async findClosest(ctx) {
	  let { lat, long, distance, ...serviceCtx } = ctx;

	  if (!distance) {
		distance = 50;
	  }
  
	  // fetch all available results
	  const medkits = await strapi.entityService.findMany('api::med-kit.med-kit', {
		fields: ['lat', 'long'],
		filters: {
		  $and: [
			{
			  lat: {
				$notNull: true
			  }
			},
			{
			  long: {
				$notNull: true
			  }
			}
		  ]
		},
		...(serviceCtx.locale
		  ? { locale: serviceCtx.locale }
		  : {}
		)
	  });
  
	  function createCoordsTuple(lat, long) {
		return [parseFloat(lat), parseFloat(long)];
	  }
  
	  let currentDistance;
  
	  const availableMedkits = medkits.filter(medkit => {
		currentDistance = haversine(
		  createCoordsTuple(lat, long),
		  createCoordsTuple(medkit.lat, medkit.long),
		  {
			format: '[lat,lon]',
			unit: 'meter'
		  }
		);
		console.log(currentDistance);
		return currentDistance < distance;
	  });
  
	  return {
		entity: availableMedkits,
		meta: {
		  distance
		}
	  };
	}
  }));
