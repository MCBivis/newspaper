export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap: async ({ strapi }: any) => {
    // Keep role creation and grant full Content API access for app roles.
    // Fine-grained restrictions are intentionally enforced only in frontend UI.
    const roleUID = "plugin::users-permissions.role";
    const permissionUID = "plugin::users-permissions.permission";
    const roleNames = ["SuperAdmin", "Illustrator", "Author", "Editor", "Advertiser"];

    for (const roleName of roleNames) {
      const existing = await strapi.db.query(roleUID).findMany({
        where: { name: roleName },
        limit: 1,
      });

      if (!existing?.[0]) {
        await strapi.db.query(roleUID).create({
          data: {
            name: roleName,
            description: `${roleName} role`,
            type: "custom",
          },
        });
      }
    }

    const allPermissions: any[] = await strapi.db.query(permissionUID).findMany();

    // Allow all Content API actions + upload plugin actions for all app roles.
    const allowActions = new Set(
      allPermissions
        .map((perm) => String(perm?.action || ""))
        .filter((action) => action.startsWith("api::") || action.startsWith("plugin::upload."))
    );
    // Needed for identity request used by frontend.
    allowActions.add("plugin::users-permissions.user.me");

    for (const roleName of roleNames) {
      const [role] = await strapi.db.query(roleUID).findMany({
        where: { name: roleName },
        limit: 1,
      });
      if (!role) continue;

      const rolePerms = await strapi.db.query(permissionUID).findMany({
        where: { role: role.id },
      });
      const existingByAction = new Map<string, any>();
      for (const perm of rolePerms) {
        existingByAction.set(String(perm.action), perm);
      }

      for (const action of allowActions) {
        const existingPerm = existingByAction.get(action);
        if (existingPerm) {
          await strapi.db.query(permissionUID).update({
            where: { id: existingPerm.id },
            data: { enabled: true },
          });
        } else {
          await strapi.db.query(permissionUID).create({
            data: {
              role: role.id,
              action,
              enabled: true,
            },
          });
        }
      }
    }
  },
};
