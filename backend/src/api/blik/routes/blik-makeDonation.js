module.exports = {
  routes: [
	{
	  method: "POST",
	  path: "/blik/makeDonation",
	  handler: "blik.makeDonation",
	  config: {
		policies: [],
		middlewares: [{
			name: 'strapi::cors',
			config: {
			  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
			  headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
			  keepHeaderOnError: true,
			},
		  },],
	  },
	},
  ],
};