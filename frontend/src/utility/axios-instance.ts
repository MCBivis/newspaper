"use client";

import { API_URL, STATIC_STRAPI_TOKEN, TOKEN_KEY } from "@utility/constants";
import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const cookieToken = Cookies.get(TOKEN_KEY);
  const token = cookieToken || STATIC_STRAPI_TOKEN;

  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  // Ensure JSON by default
  config.headers = {
    Accept: "application/json",
    ...(config.headers || {}),
  };

  return config;
});
