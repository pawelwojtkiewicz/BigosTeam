module.exports = {
  // before requesting a med kit open - determine who is doing that
  async beforeCreate({ params }) {
    const { state } = strapi.requestContext.get();
    params.data.reporter = {
      connect: [state.user.id]
    };
  },
};
