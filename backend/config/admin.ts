export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '/aOsje65YeUkxILibuevHQ=='),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'rdrlrvj/QE2336HPbK0IiA=='),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
