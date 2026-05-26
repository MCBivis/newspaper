export default {
  routes: [
    {
      method: "GET",
      path: "/app-users",
      handler: "app-user.find",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
