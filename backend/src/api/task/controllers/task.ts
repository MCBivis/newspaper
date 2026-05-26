/**
 * task controller
 */

import { factories } from '@strapi/strapi';

function normalizeRelation(value: any) {
  if (Array.isArray(value)) {
    return value.map((item) => (item && typeof item === "object" && "id" in item ? item.id : item));
  }

  if (value && typeof value === "object" && "id" in value) {
    return value.id;
  }

  return value || null;
}

function normalizeTaskPayload(ctx: any) {
  const data = ctx.request?.body?.data;
  if (!data) return;

  for (const field of [
    "newspaper",
    "issue",
    "assignee",
    "articles",
    "photos",
    "advertisments",
  ]) {
    if (field in data) {
      data[field] = normalizeRelation(data[field]);
    }
  }
}

export default factories.createCoreController('api::task.task' as any, ({ strapi }) => ({
  async create(ctx) {
    normalizeTaskPayload(ctx);
    return super.create(ctx);
  },

  async update(ctx) {
    normalizeTaskPayload(ctx);
    return super.update(ctx);
  },
}));
