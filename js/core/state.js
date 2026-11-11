/**
 * Central State Management & Live Backend Data Store
 * System runs on real data from Backend FastAPI
 */
import { showToast } from '../components/toast.js';
import { postsApi } from '../api/postsApi.js';
import { usersApi } from '../api/usersApi.js';
import { notificationsApi } from '../api/notificationsApi.js';

export const state = {
  posts: JSON.parse(localStorage.getItem("blossom_posts") || "[]"),
  users: JSON.parse(localStorage.getItem("blossom_users") || "[]"),
  notifications: JSON.parse(localStorage.getItem("blossom_notifs") || "[]"),
  currentView: "dashboard",
  currentTab: "all",
  activeApprovalPostId: null,
  deleteTargetPostId: null,
  calendarCurrentDate: new Date()
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
  try {
    localStorage.setItem("blossom_posts", JSON.stringify(state.posts));
    localStorage.setItem("blossom_users", JSON.stringify(state.users));
    localStorage.setItem("blossom_notifs", JSON.stringify(state.notifications));
  } catch (e) {
    console.warn("Storage warning:", e);
  }
  notifyStateChanged();
  if (window.updateMetricsDisplay) window.updateMetricsDisplay();
  if (window.updateNotifCounters) window.updateNotifCounters();
  if (window.renderKanbanBoard) window.renderKanbanBoard();
}

/**
 * Mapping Backend Post entity to UI representation
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
    title: p.title || "Bài viết không tên",
    author: p.author_name || `Staff #${p.author_id}`,
    category: "Chăm sóc da",
    campaign: "Chiến dịch truyền thông",
    status: mapped.status,
    statusText: mapped.statusText,
    scheduleDate: d.toISOString().split('T')[0],
    scheduleTime: d.toTimeString().slice(0, 5),
    displayDate: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`,
    channels: platformNames[p.platform_id] || "Đa kênh",
    heroImage: (Array.isArray(p.media_files) && p.media_files[0]) || "",
    content: (p.caption || "") + (p.hashtags ? "<br><br>" + p.hashtags : ""),
    reach: "0",
    engagement: "0",
    engagementRate: "0%",
    isArchived: p.status === "REJECTED",
    isMine: true
  };
}

/**
 * Mapping Backend User entity to UI representation
 */
export function mapBackendUserToUI(u) {
  const roleName = u.role_id === 1 ? "Quản lý" : "Biên tập viên";
  const name = u.full_name || u.username;
  const initials = name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() || "US";
  return {
    id: u.user_id,
    rawId: u.user_id,
    name: name,
    email: u.email,
    role: roleName,
    status: u.status === "ACTIVE" ? "Hoạt động" : "Đã khóa",
    canLogin: u.status === "ACTIVE",
    isLocked: u.status !== "ACTIVE",
    avatar: initials,
    lastLogin: u.last_login_at ? new Date(u.last_login_at).toLocaleString("vi-VN") : "Chưa đăng nhập"
  };
}

/**
 * Live Data Sync from Backend FastAPI & MySQL
 */
export async function syncDataFromBackend() {
  try {
    const [postsData, usersData, notifsData] = await Promise.all([
      postsApi.getPosts({ page: 1, page_size: 100 }).catch(() => null),
      usersApi.getUsers({ skip: 0, limit: 100 }).catch(() => null),
      notificationsApi.getNotifications().catch(() => null)
    ]);

    if (Array.isArray(postsData)) {
      state.posts = postsData.map(mapBackendPostToUI);
    }
    if (Array.isArray(usersData)) {
      state.users = usersData.map(mapBackendUserToUI);
    }
    if (Array.isArray(notifsData)) {
      state.notifications = notifsData.map(n => ({
        id: n.notification_id,
        title: n.title,
        desc: n.message,
        time: new Date(n.created_at).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }),
        unread: !n.is_read,
        targetView: n.post_id ? "approvals" : "notifications",
        targetPostId: n.post_id ? `BL-${String(n.post_id).padStart(4, '0')}` : null
      }));
    }

    saveState();

    if (window.renderPostsTable) window.renderPostsTable();
    if (window.renderKanbanBoard) window.renderKanbanBoard();
    if (window.renderUsersTable) window.renderUsersTable();
    if (window.renderCalendar) window.renderCalendar();
    if (window.renderNotificationsList) window.renderNotificationsList();
    if (window.updateMetricsDisplay) window.updateMetricsDisplay();
    if (window.updateNotifCounters) window.updateNotifCounters();
    if (window.updateStatsPeriod) window.updateStatsPeriod();

    console.log("✓ Live data synchronized from Backend FastAPI & MySQL!");
  } catch (err) {
    console.warn("Sync warning:", err);
  }
}

/**
 * Clear cached state and refresh live data
 */
export async function resetToFigmaDefaultData() {
  if (confirm("Làm mới toàn bộ dữ liệu từ máy chủ Backend MySQL?")) {
    localStorage.removeItem("blossom_posts");
    localStorage.removeItem("blossom_users");
    localStorage.removeItem("blossom_notifs");
    state.posts = [];
    state.users = [];
    state.notifications = [];
    await syncDataFromBackend();
    showToast("Đã đồng bộ lại dữ liệu mới nhất từ máy chủ!", "success");
  }
}

export function exportDataJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", `blossom_live_data_${new Date().toISOString().slice(0, 10)}.json`);
  dlAnchor.click();
  showToast("Đã xuất file dữ liệu thực tế thành công!", "success");
}
