export default ({ strapi }: any) => {
  // Keep backend upload open for any authenticated user.
  // Role-specific restrictions are enforced only in frontend UI.
  return async (ctx: any, next: any) => {
    const user = ctx.state?.user;
    if (!user) {
      return ctx.unauthorized("Authentication required");
    }

    return next();
  };
};

