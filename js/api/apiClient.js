/**
 * HTTP API Client Wrapper
 * Handles JWT Authorization headers, timeout, JSON serialization & error normalization
 */

import { APP_CONFIG } from '../config/appConfig.js';
import { STORAGE_KEYS } from '../constants/enums.js';

class ApiClient {
  constructor(baseUrl = APP_CONFIG.API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  getAuthToken() {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || null;
    } catch {
      return null;
    }
  }

  setAuthToken(token, persistent = true) {
    try {
      if (token) {
        if (persistent) {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
        } else {
          sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
        }
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      }
    } catch (e) {
      console.warn("Storage warning:", e);
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`;
    const token = this.getAuthToken();
    
    const headers = {
      ...options.headers
    };

    // If body is NOT FormData, set Content-Type: application/json
    const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
    if (!isFormData && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), options.timeout || APP_CONFIG.REQUEST_TIMEOUT) : null;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller ? controller.signal : undefined
      });

      if (timeoutId) clearTimeout(timeoutId);

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.setAuthToken(null);
        if (typeof window !== "undefined" && window.location && !window.location.pathname.includes("login")) {
          // If in SPA, could trigger session timeout
          console.warn("API 401 Unauthorized - Session expired");
        }
      }

      // Parse JSON response safely
      let data = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const error = new Error((data && data.detail) || response.statusText || `HTTP Error ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error(`Yêu cầu tới máy chủ vượt quá thời gian chờ (${APP_CONFIG.REQUEST_TIMEOUT / 1000}s)`);
      }
      throw err;
    }
  }

  get(endpoint, queryParams = {}, options = {}) {
    let url = endpoint;
    const query = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
    return this.request(url, { method: 'GET', ...options });
  }

  post(endpoint, body, options = {}) {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return this.request(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
      ...options
    });
  }

  put(endpoint, body, options = {}) {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return this.request(endpoint, {
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body),
      ...options
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...options
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }
}

export const apiClient = new ApiClient();
