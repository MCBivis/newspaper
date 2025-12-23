const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const NEXT_PUBLIC_TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY;
const NEXT_PUBLIC_STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

// Default to Strapi's standard port so the frontend hits the running backend
// even when no env override is provided.
export const API_URL = NEXT_PUBLIC_API_URL || "http://localhost:1337";
export const TOKEN_KEY = NEXT_PUBLIC_TOKEN_KEY || "strapi-jwt-token";

// Public/long-lived Strapi token for read access when a user token is absent.
export const STATIC_STRAPI_TOKEN = NEXT_PUBLIC_STRAPI_TOKEN;

export const MEDIA_URL = API_URL; // Базовый URL для медиа файлов
