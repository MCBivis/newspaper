export default {
  find: async (ctx: any) => {
    const authHeader = ctx.request?.header?.authorization || ctx.request?.headers?.authorization;
    const token =
      typeof authHeader === "string" && authHeader.startsWith("Bearer ")
        ? authHeader.slice("Bearer ".length)
        : null;

    if (!token) {
      return ctx.unauthorized("Missing Bearer token");
    }

    try {
      const jwtService = strapi.plugin("users-permissions").service("jwt");
      await jwtService.verify(token);

      const rawRoles = ctx.query?.roles || ctx.query?.role;
      const roleNames = String(Array.isArray(rawRoles) ? rawRoles.join(",") : rawRoles || "")
        .split(",")
        .map((role) => role.trim())
        .filter(Boolean);

      const roleUID = "plugin::users-permissions.role";
      const userUID = "plugin::users-permissions.user";

      let roleIds: number[] | undefined;
      if (roleNames.length > 0) {
        const roles = await strapi.db.query(roleUID).findMany({
          where: { name: { $in: roleNames } },
        });
        roleIds = roles.map((role: any) => role.id);
      }

      const users = await strapi.db.query(userUID).findMany({
        where: {
          blocked: false,
          ...(roleIds ? { role: { id: { $in: roleIds } } } : {}),
        },
        populate: ["role"],
        orderBy: { username: "asc" },
      });

      ctx.body = {
        data: users.map((user: any) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
            ? {
                id: user.role.id,
                name: user.role.name,
              }
            : null,
        })),
      };
    } catch (e) {
      return ctx.unauthorized("Invalid token");
    }
  },
};
