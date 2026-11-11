/**
 * View Router: SPA Screen Switching
 */
import { state } from './state.js';
import { showToast } from '../components/toast.js';
import { closeAllDropdowns } from '../components/dropdown.js';
import { renderKanbanBoard } from '../views/dashboardView.js';
import { renderPostsTable } from '../views/postsView.js';
import { renderCalendar } from '../views/calendarView.js';
import { renderApprovalView } from '../views/approvalsView.js';
import { renderNotificationsList } from '../views/notificationsView.js';
import { renderUsersTable } from '../views/usersView.js';

export function switchView(viewName) {
  state.currentView = viewName;

  // Toggle auth-mode on app container for full-bleed Login view
  const appContainer = document.getElementById("appContainer");
  if (appContainer) {
    if (viewName === "login") {
      appContainer.classList.add("auth-mode");
    } else {
      appContainer.classList.remove("auth-mode");
    }
  }

  // Update panels
  document.querySelectorAll(".view-panel").forEach(panel => {
    panel.classList.remove("active");
  });
  const targetPanel = document.getElementById(`view-${viewName}`);
  if (targetPanel) {
    targetPanel.classList.add("active");
  }

  // Update Sidebar active state
  document.querySelectorAll(".nav-item").forEach(item => {
    if (item.getAttribute("data-view") === viewName) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Close any popovers
  closeAllDropdowns();

  // View specific refreshes
  if (viewName === "dashboard") {
    renderKanbanBoard();
  } else if (viewName === "posts") {
    renderPostsTable();
  } else if (viewName === "calendar") {
    renderCalendar();
  } else if (viewName === "approvals") {
    renderApprovalView(state.activeApprovalPostId);
  } else if (viewName === "notifications") {
    renderNotificationsList();
  } else if (viewName === "users") {
    const user = JSON.parse(localStorage.getItem("blossom_current_user") || "{}");
    if (user.role_code === "STAFF" || user.role_id === 2) {
      showToast("Chức năng Quản lý Người dùng & Phân quyền chỉ dành riêng cho Marketing Manager!", "warning");
      // Fallback back to dashboard
      switchView("dashboard");
      return;
    }
    renderUsersTable();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
