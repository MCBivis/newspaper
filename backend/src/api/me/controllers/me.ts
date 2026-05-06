export default {
  me: async (ctx: any) => {
    const authHeader = ctx.request?.header?.authorization || ctx.request?.headers?.authorization;
    const token = typeof authHeader === "string" && authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;

    if (!token) {
      return ctx.unauthorized("Missing Bearer token");
    }

    try {
      const jwtService = strapi.plugin("users-permissions").service("jwt");
      const payload = await jwtService.verify(token);

      const userId = payload?.id;
      if (!userId) {
        return ctx.unauthorized("Invalid token payload");
      }

      const fullUser = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        userId,
        { populate: ["role"] }
      );

      ctx.body = fullUser;
    } catch (e) {
      return ctx.unauthorized("Invalid token");
    }
  },
};

