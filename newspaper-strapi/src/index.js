// path: ./src/index.js

module.exports = {
  /**
   * An asynchronous register function that runs before Strapi is initialized.
   *
   * This lifecycle is executed during the "register" phase (before `bootstrap()`)
   * of the Strapi application lifecycle. It runs before any Strapi APIs are
   * available. Its main purpose is to extend Strapi with custom data models
   * and services, add custom fields to existing data models, or register new
   * content types and plugins.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before Strapi is initialized.
   *
   * This lifecycle is executed during the "bootstrap" phase (after `register())
   * of the Strapi application lifecycle. It runs before any Strapi APIs are
   * available.
   */
  bootstrap(/*{ strapi }*/) {},
};
