/**
 * MOD-01: Authentication & Session API
 */

import { apiClient } from './apiClient.js';
import { STORAGE_KEYS } from '../constants/enums.js';

export const authApi = {
  async login(usernameOrEmail, password, remember = true) {
    const data = await apiClient.post('auth/login', {
      username_or_email: usernameOrEmail,
      password: password
    });

    if (data && data.access_token) {
      apiClient.setAuthToken(data.access_token, remember);
      try {
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(data.user));
        sessionStorage.setItem(STORAGE_KEYS.LOGGED_IN, "true");
      } catch (e) {
        console.warn("Storage write error:", e);
      }
    }
    return data;
  },

  async logout() {
    try {
      await apiClient.post('auth/logout');
    } catch (e) {
      console.warn("Backend logout warning:", e);
    } finally {
      apiClient.setAuthToken(null);
      try {
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);
        sessionStorage.removeItem(STORAGE_KEYS.LOGGED_IN);
      } catch {}
    }
  },

  async getMe() {
    return apiClient.get('auth/me');
  }
};
