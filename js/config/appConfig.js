/**
 * Application Global Configuration
 * Blossom Beauty Store Frontend
 */

export const APP_CONFIG = {
  // Base URL của Backend FastAPI (Mặc định http://localhost:8000/api)
  API_BASE_URL: (typeof window !== "undefined" && window.__API_BASE_URL__) || "http://localhost:8000/api",
  
  // WebSocket endpoint cho thông báo thời gian thực (Backend /api/ws/notifications)
  WS_BASE_URL: (typeof window !== "undefined" && window.__WS_BASE_URL__) || "ws://localhost:8000/api/ws/notifications",
  
  // Timeout mặc định cho HTTP Request (ms)
  REQUEST_TIMEOUT: 15000,
  
  // Cờ kích hoạt Mock Fallback (Đã tắt hoàn toàn để chạy 100% dữ liệu thực từ Backend & MySQL)
  ENABLE_MOCK_FALLBACK: false,
  
  // Phiên bản Frontend
  VERSION: "1.1.0"
};
