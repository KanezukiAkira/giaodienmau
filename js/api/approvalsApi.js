/**
 * MOD-04: Approval Workflow API
 */

import { apiClient } from './apiClient.js';

export const approvalsApi = {
  async submitForApproval(postId, submitData = {}) {
    return apiClient.post(`posts/${postId}/submit`, submitData);
  },

  async approvePost(postId) {
    return apiClient.post(`posts/${postId}/approve`, {});
  },

  async rejectPost(postId, actionData) {
    return apiClient.post(`posts/${postId}/reject`, actionData);
  },

  async getApprovalHistory(postId) {
    return apiClient.get(`posts/${postId}/approvals`);
  }
};
