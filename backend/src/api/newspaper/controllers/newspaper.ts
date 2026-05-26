/**
 * newspaper controller
 */

import { factories } from '@strapi/strapi'

function normalizeRelationId(value: any) {
  if (value && typeof value === "object" && "id" in value) {
    return value.id;
  }

  return value || null;
}

function normalizeNewspaperPayload(ctx: any) {
  const data = ctx.request?.body?.data;
  if (!data) return;

  if ("responsibleEditor" in data) {
    data.responsibleEditor = normalizeRelationId(data.responsibleEditor);
  }

  if ("layout" in data) {
    data.layout = normalizeRelationId(data.layout);
  }

  if ("photo" in data) {
    data.photo = normalizeRelationId(data.photo);
  }
}

export default factories.createCoreController('api::newspaper.newspaper', ({ strapi }) => ({
  async create(ctx) {
    normalizeNewspaperPayload(ctx);
    return super.create(ctx);
  },

  async update(ctx) {
    normalizeNewspaperPayload(ctx);
    return super.update(ctx);
  },
}));
