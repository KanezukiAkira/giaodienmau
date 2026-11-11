/**
 * MOD-02: User & RBAC Management API
 */

import { apiClient } from './apiClient.js';

export const usersApi = {
  async getUsers(params = { skip: 0, limit: 50 }) {
    return apiClient.get('users', params);
  },

  async createUser(userData) {
    return apiClient.post('users', userData);
  },

  async updateUser(userId, userData) {
    return apiClient.put(`users/${userId}`, userData);
  },

  async updateUserStatus(userId, status) {
    return apiClient.patch(`users/${userId}/status`, { status });
  }
};
