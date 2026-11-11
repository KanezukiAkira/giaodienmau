/**
 * Notifications & Real-Time WebSocket API
 */

import { apiClient } from './apiClient.js';
import { APP_CONFIG } from '../config/appConfig.js';

export const notificationsApi = {
  async getNotifications() {
    return apiClient.get('notifications');
  },

  async markAsRead(notificationId) {
    return apiClient.patch(`notifications/${notificationId}/read`, {});
  },

  connectWebSocket(token, onMessage, onError, onClose) {
    if (typeof WebSocket === "undefined") {
      console.warn("WebSocket is not supported in this environment");
      return null;
    }

    const wsUrl = `${APP_CONFIG.WS_BASE_URL}?token=${token || ''}`;
    try {
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (onMessage) onMessage(payload);
        } catch {
          if (onMessage) onMessage(event.data);
        }
      };

      ws.onerror = (err) => {
        console.warn("WebSocket connection error:", err);
        if (onError) onError(err);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        if (onClose) onClose();
      };

      return ws;
    } catch (e) {
      console.error("Failed to initialize WebSocket:", e);
      return null;
    }
  }
};
