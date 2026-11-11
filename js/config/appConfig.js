/**
 * Application Global Configuration
 * Blossom Beauty Store Frontend
 */

export const APP_CONFIG = {
  // Base URL của Backend FastAPI (Mặc định http://localhost:8000/api)
  API_BASE_URL: (typeof window !== "undefined" && window.__API_BASE_URL__) || "http://localhost:8000/api",
  
  // WebSocket endpoint cho thông báo thời gian thực
  WS_BASE_URL: (typeof window !== "undefined" && window.__WS_BASE_URL__) || "ws://localhost:8000/api/notifications/ws",
  
  // Timeout mặc định cho HTTP Request (ms)
  REQUEST_TIMEOUT: 15000,
  
  // Cờ kích hoạt Mock Fallback (nếu Backend chưa online thì fallback sang LocalStorage / mockData)
  ENABLE_MOCK_FALLBACK: true,
  
  // Phiên bản Frontend
  VERSION: "1.1.0"
};
