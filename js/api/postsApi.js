/**
 * MOD-03: Content & Media Management API
 */

import { apiClient } from './apiClient.js';

export const postsApi = {
  async getPosts(filterParams = {}) {
    return apiClient.get('posts', filterParams);
  },

  async getPostById(postId) {
    return apiClient.get(`posts/${postId}`);
  },

  async createPost(postData) {
    return apiClient.post('posts', postData);
  },

  async updatePost(postId, postData) {
    return apiClient.put(`posts/${postId}`, postData);
  },

  async deletePost(postId) {
    return apiClient.delete(`posts/${postId}`);
  },

  async uploadMedia(file) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('posts/upload-media', formData);
  }
};
