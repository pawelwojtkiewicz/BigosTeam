
"use strict";

/**
 * blik service
 */

const { createCoreService } = require("@strapi/strapi").factories;
const axios = require('axios');

module.exports = createCoreService("api::blik.blik", ({ strapi }) => ({
  async makeDonation(ctx) {

  const { amount, payMethodValue } = ctx.request.body;
    const url = "https://secure.snd.payu.com/api/v2_1/orders";
    const token = "d9a4536e-62ba-4f60-8017-6053211d3f47";
    const data = {
      currencyCode: "PLN",
      totalAmount: amount,
      description: "Darowizna",
      notifyUrl: "https://your.eshop.com/notify",
      customerIp: "127.0.0.1",
      merchantPosId: "300746",
      products: [
        {
          name: "Darowizna", // Updated product name
          unitPrice: amount,
          quantity: "1",
        },
      ],
      buyer: {
        extCustomerId: "customer123",
        email: "john.doe@email.com",
      },
      payMethods: {
        payMethod: {
          type: "BLIK_AUTHORIZATION_CODE",
          value: payMethodValue,
          blikData: {
            aliasLabelProposal: "token for eshop.pl",
            register: true,
          },
        },
      },
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      ctx.send(response.data);
    } catch (error) {
		console.log(error);
      ctx.throw(500, error);
    }
  }
}));
