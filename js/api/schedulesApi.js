/**
 * MOD-05: Scheduling & Content Calendar API
 */

import { apiClient } from './apiClient.js';

export const schedulesApi = {
  async getCalendarEvents(startDate, endDate) {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    return apiClient.get('schedules/calendar', params);
  },

  async updateSchedule(postId, scheduleData) {
    return apiClient.put(`schedules/${postId}`, scheduleData);
  }
};
