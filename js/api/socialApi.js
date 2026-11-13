/**
 * MOD-Social: Social Media Integration API (Facebook, Instagram, TikTok)
 */

import { apiClient } from './apiClient.js';

function getDefaultRedirect(path) {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}${path}`;
  }
  return `http://localhost:5500${path}`;
}

export const socialApi = {
  // --- Facebook & Instagram ---
  async getFacebookLoginUrl(redirectUri = getDefaultRedirect("/oauth/facebook/callback")) {
    return apiClient.get(`social/facebook/login-url?redirect_uri=${encodeURIComponent(redirectUri)}`);
  },

  async exchangeFacebookCode(code, redirectUri = getDefaultRedirect("/oauth/facebook/callback")) {
    return apiClient.post('social/facebook/exchange-token', { code, redirect_uri: redirectUri });
  },

  async getManagedAccounts(userAccessToken) {
    return apiClient.get(`social/accounts?user_access_token=${encodeURIComponent(userAccessToken)}`);
  },

  async syncFacebookMetrics(postId, fbPostId, accessToken) {
    return apiClient.post(`social/posts/${postId}/sync-facebook`, {
      fb_post_id: fbPostId,
      access_token: accessToken
    });
  },

  async syncInstagramMetrics(postId, igMediaId, accessToken) {
    return apiClient.post(`social/posts/${postId}/sync-instagram`, {
      ig_media_id: igMediaId,
      access_token: accessToken
    });
  },

  // --- TikTok ---
  async getTikTokLoginUrl(redirectUri = getDefaultRedirect("/oauth/tiktok/callback")) {
    return apiClient.get(`social/tiktok/login-url?redirect_uri=${encodeURIComponent(redirectUri)}`);
  },

  async exchangeTikTokCode(code, redirectUri = getDefaultRedirect("/oauth/tiktok/callback")) {
    return apiClient.post('social/tiktok/exchange-token', { code, redirect_uri: redirectUri });
  },

  async syncTikTokMetrics(postId, videoId, accessToken) {
    return apiClient.post(`social/posts/${postId}/sync-tiktok`, {
      video_id: videoId,
      access_token: accessToken
    });
  },

  // --- Tự động hóa đồng bộ theo bài viết (Unified Sync) ---
  async syncPostMetrics(postId) {
    return apiClient.post(`social/posts/${postId}/sync`);
  }
};
