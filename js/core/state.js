/**
 * Central State Management & LocalStorage Persistence
 */
import { DEFAULT_POSTS, DEFAULT_USERS, DEFAULT_NOTIFICATIONS } from '../data/mockData.js';
import { showToast } from '../components/toast.js';

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
