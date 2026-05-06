"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { API_URL, TOKEN_KEY } from "@utility/constants";

// Minimal refine authProvider based on Strapi JWT auth.
// Refine will use it for `useGetIdentity` / `<Authenticated />`.
export const authProvider: any = {
  login: async (params: any) => {
    const { username, identifier, password } = params || {};
    const loginIdentifier = identifier || username;

    const { data } = await axios.post(`${API_URL}/api/auth/local`, {
      identifier: loginIdentifier,
      password,
    });

    const jwt = data?.jwt;
    if (jwt) {
      Cookies.set(TOKEN_KEY, jwt, {
        expires: 7,
        sameSite: "lax",
        path: "/",
      });
    }

    return {
      success: true,
    };
  },

  logout: async () => {
    try {
      const token = Cookies.get(TOKEN_KEY);
      if (token) {
        await axios.post(
          `${API_URL}/api/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch {
      // ignore logout errors; we'll clear cookie anyway
    } finally {
      Cookies.remove(TOKEN_KEY, { path: "/" });
    }

    return { success: true };
  },

  check: async () => {
    const token = Cookies.get(TOKEN_KEY);
    return token ? { authenticated: true } : { authenticated: false };
  },

  getIdentity: async () => {
    const token = Cookies.get(TOKEN_KEY);
    if (!token) return null;

    // Use custom backend endpoint that always returns populated role.
    const { data } = await axios.get(`${API_URL}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};

