/**
 * Application Global Configuration
 * Blossom Beauty Store Frontend
 * Đã cấu hình trỏ trực tiếp về Backend Production trên Render
 */

export const APP_CONFIG = {
  // Base URL của Backend FastAPI trên Render
  API_BASE_URL: (typeof window !== "undefined" && window.__API_BASE_URL__) || "https://backend-facj.onrender.com/api",
  
  // WebSocket endpoint cho thông báo thời gian thực (Backend /api/ws/notifications qua giao thức WSS)
  WS_BASE_URL: (typeof window !== "undefined" && window.__WS_BASE_URL__) || "wss://backend-facj.onrender.com/api/ws/notifications",
  
  // Timeout mặc định cho HTTP Request (ms)
  REQUEST_TIMEOUT: 15000,
  
  // Cờ kích hoạt Mock Fallback (Đã tắt hoàn toàn để chạy 100% dữ liệu thực từ Backend & TiDB Cloud)
  ENABLE_MOCK_FALLBACK: false,
  
  // Phiên bản Frontend
  VERSION: "1.1.0"
};
