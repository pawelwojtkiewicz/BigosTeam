module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/product/:productId/medKitsEquippedWith',
      handler: 'product.findEquippedWithMedKits'
    }
  ]
};
