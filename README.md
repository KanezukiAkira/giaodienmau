# HỆ THỐNG QUẢN TRỊ TRUYỀN THÔNG ĐA KÊNH — FRONTEND UI
## (BLOSSOM BEAUTY STORE CMS FRONTEND)

[![JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E.svg?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
[![CSS3](https://img.shields.io/badge/CSS3-Modular%20CSS-1572B6.svg?logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26.svg?logo=html5)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![FastAPI Ready](https://img.shields.io/badge/Backend-FastAPI%20Ready-009688.svg?logo=fastapi)](http://localhost:8000/docs)

> **Dự án Thực tập:** RikkeiLab 2  
> **Nhóm thực hiện:** Nhóm 7  
> **Khách hàng giả định:** Công ty Mỹ phẩm Hàn Quốc Blossom  
> **Tài liệu tham chiếu:** Thiết kế Figma (Blossom Beauty Store) & SDD v1.1

---

## 📖 MỤC LỤC
1. [Giới thiệu](#1-giới-thiệu)
2. [Cấu trúc thư mục Frontend](#2-cấu-trúc-thư-mục-frontend)
3. [Tích hợp 7 Module nghiệp vụ](#3-tích-hợp-7-module-nghiệp-vụ)
4. [Hướng dẫn cài đặt & Chạy cục bộ](#4-hướng-dẫn-cài-đặt--chạy-cục-bộ)
5. [Cấu hình kết nối API & Chế độ hoạt động](#5-cấu-hình-kết-nối-api--chế-độ-hoạt-động)
6. [Quy chuẩn kiểm thử tự động](#6-quy-chuẩn-kiểm-thử-tự-động)

---

## 1. GIỚI THIỆU

Giao diện người dùng (Frontend UI) của Hệ thống Quản trị Truyền thông Đa kênh Blossom Beauty Store được xây dựng theo kiến trúc **Single Page Application (SPA)** thuần với **ES Modules hiện đại** và **CSS phân tầng**. Kiến trúc này đảm bảo:
- **Tải tức thì (Zero-build latency)**: Chạy trực tiếp trên mọi trình duyệt hiện đại không cần bước biên dịch phức tạp.
- **Tính module hóa cao**: Tách biệt rõ ràng giữa View, Component, Core Router, State Store và API Client.
- **Hỗ trợ Dual-Mode (Chế độ kép)**: Có khả năng chạy độc lập hoàn toàn với Mock Data để trình diễn UI, đồng thời có sẵn tầng API Client để kết nối trực tiếp với Backend FastAPI.

---

## 2. CẤU TRÚC THƯ MỤC FRONTEND

```
Frontend/
├── .github/
│   └── pull_request_template.md        # Biểu mẫu kiểm duyệt PR Frontend chuẩn
├── .gitignore                          # Loại trừ các file rác và dependencies
├── README.md                           # Tài liệu hướng dẫn sử dụng và kiến trúc
├── package.json                        # Cấu hình npm scripts & metadata
├── index.html                          # Trang chủ Single Page Application (Dashboard & 7 Module)
├── login.html                          # Trang Đăng nhập độc lập
├── assets/                             # Tài nguyên tĩnh
│   └── images/                         # Ảnh sản phẩm mỹ phẩm, logo, banner
├── css/                                # Kiến trúc CSS phân tầng theo 7-1 pattern
│   ├── base/                           # reset.css, typography.css, variables.css
│   ├── components/                     # buttons, cards, forms, modals, tables, toast
│   ├── layout/                         # header.css, layout.css, sidebar.css
│   ├── views/                          # Style cho từng màn hình riêng biệt
│   └── main.css                        # CSS Master nạp toàn bộ hệ thống style
├── js/                                 # Kiến trúc JavaScript ES Modules
│   ├── config/                         # Cấu hình môi trường API & URL
│   │   └── appConfig.js                # API_BASE_URL, WS_URL, mock toggle
│   ├── constants/                      # Enums & Constants chuẩn
│   │   └── enums.js                    # PostStatus, Roles, Platforms, StorageKeys
│   ├── api/                            # Tầng giao tiếp REST API Backend FastAPI
│   │   ├── apiClient.js                # Fetch wrapper gắn JWT token tự động
│   │   ├── authApi.js                  # MOD-01: Login, Logout, Profile
│   │   ├── usersApi.js                 # MOD-02: Quản lý người dùng & RBAC
│   │   ├── postsApi.js                 # MOD-03: CRUD bài viết, upload media
│   │   ├── approvalsApi.js             # MOD-04: Quy trình phê duyệt bài viết
│   │   ├── schedulesApi.js             # MOD-05: Content Calendar & Lịch đăng
│   │   ├── trackingApi.js              # MOD-06: Xác nhận đăng bài thực tế
│   │   ├── analyticsApi.js             # MOD-07: Thống kê chỉ số & xuất CSV
│   │   └── notificationsApi.js         # Thông báo thời gian thực & WebSocket
│   ├── core/                           # Điều khiển trung tâm
│   │   ├── router.js                   # SPA Client Router chuyển đổi màn hình mượt mà
│   │   └── state.js                    # Quản lý State tập trung & LocalStorage
│   ├── components/                     # UI Logic dùng chung (dropdown, modal, toast)
│   ├── views/                          # Điều khiển logic hiển thị từng màn hình
│   ├── utils/                          # Hàm định dạng ngày tháng, chuỗi, sự kiện
│   ├── data/                           # Dữ liệu mẫu chuẩn gốc Figma
│   │   └── mockData.js
│   └── main.js                         # Entry point bootstrap toàn bộ ứng dụng
└── tests/                              # Bộ kiểm thử tự động
    └── test_modular.mjs                # Kiểm tra toàn vẹn DOM IDs và Event Handlers
```

---

## 3. TÍCH HỢP 7 MODULE NGHIỆP VỤ

| Module | Tên Module | Màn hình Frontend | API Service tương ứng |
| :--- | :--- | :--- | :--- |
| **MOD-01** | Xác thực & Phiên làm việc | `view-login` / `login.html` | `js/api/authApi.js` |
| **MOD-02** | Quản lý Người dùng & RBAC | `view-users` | `js/api/usersApi.js` |
| **MOD-03** | Quản lý Bài viết & Media | `view-posts`, `view-editor` | `js/api/postsApi.js` |
| **MOD-04** | Quy trình Phê duyệt | `view-approvals` | `js/api/approvalsApi.js` |
| **MOD-05** | Lịch đăng bài & Content Calendar | `view-calendar` | `js/api/schedulesApi.js` |
| **MOD-06** | Theo dõi Tiến độ đăng bài | `view-dashboard` (Kanban Board) | `js/api/trackingApi.js` |
| **MOD-07** | Thống kê & Báo cáo hiệu quả | `view-statistics` | `js/api/analyticsApi.js` |

---

## 4. HƯỚNG DẪN CÀI ĐẶT & CHẠY CỤC BỘ

### Yêu cầu:
- Node.js $\ge$ 18.x

### Khởi chạy:
```bash
# Di chuyển vào thư mục Frontend
cd Frontend

# Chạy server với live-server tự động mở trình duyệt tại port 5500
npm start

# Hoặc dùng serve:
npm run serve
```

Ứng dụng sẽ tự động mở tại `http://localhost:5500/index.html`.

---

## 5. CẤU HÌNH KẾT NỐI API & CHẾ ĐỘ HOẠT ĐỘNG

Tệp `js/config/appConfig.js` quy định cấu hình kết nối tới Backend:

```javascript
export const APP_CONFIG = {
  API_BASE_URL: "http://localhost:8000/api",
  WS_BASE_URL: "ws://localhost:8000/api/notifications/ws",
  ENABLE_MOCK_FALLBACK: true  // Tự động dùng Mock Data nếu Backend chưa online
};
```

---

## 6. QUY CHUẨN KIỂM THỬ TỰ ĐỘNG

Chạy kiểm thử trước khi commit hoặc tạo PR:
```bash
npm test
```
Bộ kiểm thử sẽ tự động xác minh:
1. 100% các DOM Element IDs tham chiếu trong mã Javascript đều tồn tại trong `index.html`.
2. Toàn bộ 57 hàm handler được gán đúng lên `window`.
3. Kiểm thử tương tác mô phỏng qua 11 luồng: Dashboard, Kanban drag/drop, Lịch, Phê duyệt, Bộ lọc, Tạo bản nháp, Báo cáo thống kê, v.v.
