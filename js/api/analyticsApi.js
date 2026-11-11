/**
 * MOD-07: Analytics & Reporting API
 */

import { apiClient } from './apiClient.js';

export const analyticsApi = {
  async getDashboardSummary() {
    return apiClient.get('analytics/dashboard');
  },

  async recordPostStatistics(postId, statData) {
    return apiClient.post(`posts/${postId}/statistics`, statData);
  },

  async exportReportData() {
    return apiClient.get('analytics/export');
  }
};
