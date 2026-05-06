export default {
  routes: [
    {
      method: "GET",
      path: "/me",
      handler: "me.me",
      config: {
        // Public route; JWT is verified inside the controller.
        // This avoids Strapi role/permission configuration for this endpoint.
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};

