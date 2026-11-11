/**
 * Central State Management & LocalStorage Persistence
 * Supports Dual-Mode: Live Backend API Synchronization & Mock LocalStorage Fallback
 */
import { DEFAULT_POSTS, DEFAULT_USERS, DEFAULT_NOTIFICATIONS } from '../data/mockData.js';
import { showToast } from '../components/toast.js';
import { postsApi } from '../api/postsApi.js';
import { usersApi } from '../api/usersApi.js';

export const state = {
  posts: JSON.parse(localStorage.getItem("blossom_posts")) || DEFAULT_POSTS,
  users: JSON.parse(localStorage.getItem("blossom_users")) || DEFAULT_USERS,
  notifications: JSON.parse(localStorage.getItem("blossom_notifs")) || DEFAULT_NOTIFICATIONS,
  currentView: "dashboard",
  currentTab: "all",
  activeApprovalPostId: "BL-0127",
  deleteTargetPostId: null,
  calendarCurrentDate: new Date(2026, 10, 1) // November 2026
};

// Handlers that subscribe to state updates
let stateSubscribers = [];

export function subscribeToState(fn) {
  stateSubscribers.push(fn);
}

export function notifyStateChanged() {
  stateSubscribers.forEach(fn => fn(state));
}

export function saveState() {
  localStorage.setItem("blossom_posts", JSON.stringify(state.posts));
  localStorage.setItem("blossom_users", JSON.stringify(state.users));
  localStorage.setItem("blossom_notifs", JSON.stringify(state.notifications));
  notifyStateChanged();
  if (window.updateMetricsDisplay) window.updateMetricsDisplay();
  if (window.updateNotifCounters) window.updateNotifCounters();
  if (window.renderKanbanBoard) window.renderKanbanBoard();
}

/**
 * Mapping Backend Post response to Frontend UI format
 */
export function mapBackendPostToUI(p) {
  const statusMap = {
    "DRAFT": { status: "draft", statusText: "Bản nháp" },
    "PENDING_APPROVAL": { status: "pending", statusText: "Chờ duyệt" },
    "REVISION_REQUESTED": { status: "revising", statusText: "Cần sửa" },
    "REJECTED": { status: "rejected", statusText: "Từ chối" },
    "APPROVED": { status: "approved", statusText: "Đã duyệt" },
    "SCHEDULED": { status: "scheduled", statusText: "Đã lên lịch" },
    "PUBLISHED": { status: "published", statusText: "Đã xuất bản" }
  };
  const platformNames = { 1: "Facebook", 2: "Instagram", 3: "TikTok" };
  const mapped = statusMap[p.status] || { status: (p.status || "draft").toLowerCase(), statusText: p.status || "Bản nháp" };
  const d = p.planned_publish_time ? new Date(p.planned_publish_time) : new Date(p.created_at || Date.now());

  return {
    id: `BL-${String(p.post_id).padStart(4, '0')}`,
    rawId: p.post_id,
    title: p.title,
    author: p.author_name || "Trần Thu Hà",
    category: "Chăm sóc da",
    campaign: "Chiến dịch truyền thông",
    status: mapped.status,
    statusText: mapped.statusText,
    scheduleDate: d.toISOString().split('T')[0],
    scheduleTime: d.toTimeString().slice(0, 5),
    displayDate: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`,
    channels: platformNames[p.platform_id] || "Facebook & Instagram",
    heroImage: (Array.isArray(p.media_files) && p.media_files[0]) || "assets/images/login-skincare-figma.jpg",
    content: (p.caption || "") + (p.hashtags ? "<br><br>" + p.hashtags : ""),
    reach: "15.420",
    engagement: "1.584",
    engagementRate: "10,2%",
    isArchived: false,
    isMine: true
  };
}

/**
 * Mapping Backend User response to Frontend UI format
 */
export function mapBackendUserToUI(u) {
  const roleName = u.role_id === 1 ? "Quản lý" : "Biên tập viên";
  return {
    id: `NV-${String(u.user_id).padStart(4, '0')}`,
    rawId: u.user_id,
    name: u.full_name || u.username,
    email: u.email,
    role: roleName,
    status: u.status === "ACTIVE" ? "Đang hoạt động" : "Bị khóa",
    canLogin: u.status === "ACTIVE",
    isLocked: u.status !== "ACTIVE",
    avatar: (u.full_name || u.username).split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  };
}

/**
 * Fetch and synchronize data from live Backend FastAPI
 */
export async function syncDataFromBackend() {
  try {
    const [posts, users] = await Promise.all([
      postsApi.getPosts({ page: 1, page_size: 50 }).catch(() => null),
      usersApi.getUsers().catch(() => null)
    ]);

    let updated = false;
    if (Array.isArray(posts) && posts.length > 0) {
      state.posts = posts.map(mapBackendPostToUI);
      updated = true;
    }
    if (Array.isArray(users) && users.length > 0) {
      state.users = users.map(mapBackendUserToUI);
      updated = true;
    }

    if (updated) {
      saveState();
      if (window.renderPostsTable) window.renderPostsTable();
      if (window.renderKanbanBoard) window.renderKanbanBoard();
      if (window.renderUsersTable) window.renderUsersTable();
      if (window.renderCalendar) window.renderCalendar();
      if (window.updateMetricsDisplay) window.updateMetricsDisplay();
      console.log("✓ Đồng bộ dữ liệu thành công từ Backend FastAPI!");
    }
  } catch (e) {
    console.warn("Backend sync notice:", e.message);
  }
}

export function resetToFigmaDefaultData() {
  if (confirm("Khôi phục toàn bộ bài viết và dữ liệu mẫu về thiết kế gốc trên Figma?")) {
    localStorage.removeItem("blossom_posts");
    localStorage.removeItem("blossom_users");
    localStorage.removeItem("blossom_notifs");
    state.posts = JSON.parse(JSON.stringify(DEFAULT_POSTS));
    state.users = JSON.parse(JSON.stringify(DEFAULT_USERS));
    state.notifications = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS));
    saveState();
    if (window.renderPostsTable) window.renderPostsTable();
    if (window.renderCalendar) window.renderCalendar();
    if (window.renderNotificationsList) window.renderNotificationsList();
    if (window.renderUsersTable) window.renderUsersTable();
    showToast("Đã khôi phục dữ liệu mẫu gốc từ Figma thành công!", "success");
  }
}

export function exportDataJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "blossom_mock_data.json");
  dlAnchor.click();
  showToast("Đã xuất file blossom_mock_data.json!", "success");
}
