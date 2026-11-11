/**
 * MOD-06: Progress Tracking API
 */

import { apiClient } from './apiClient.js';

export const trackingApi = {
  async confirmPublished(postId, publishedUrl) {
    return apiClient.patch(`posts/${postId}/publish`, {
      published_url: publishedUrl
    });
  }
};
