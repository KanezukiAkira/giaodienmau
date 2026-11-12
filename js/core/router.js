/**
 * View Router: SPA Screen Switching with Role-Based Route Guards
 */
import { state } from './state.js';
import { showToast } from '../components/toast.js';
import { closeAllDropdowns } from '../components/dropdown.js';
import { canAccessView, getCurrentUser, applyRolePermissionsUI } from './permissions.js';
import { renderKanbanBoard } from '../views/dashboardView.js';
import { renderPostsTable } from '../views/postsView.js';
import { renderCalendar } from '../views/calendarView.js';
import { renderApprovalView } from '../views/approvalsView.js';
import { renderNotificationsList } from '../views/notificationsView.js';
import { renderUsersTable } from '../views/usersView.js';
import { updateStatsPeriod } from '../views/statisticsView.js';

export function switchView(viewName) {
  const user = getCurrentUser();

  // Role Guard: Check if the role is permitted to view this module
  if (!canAccessView(viewName, user)) {
    let warningMsg = "Bạn không có quyền truy cập tính năng này!";
    if (viewName === "users") {
      warningMsg = "Chức năng Quản lý Người dùng & Phân quyền chỉ dành riêng cho Marketing Manager!";
    } else if (viewName === "statistics") {
      warningMsg = "Chức năng Báo cáo & Thống kê chỉ dành riêng cho Marketing Manager!";
    } else if (viewName === "approvals") {
      warningMsg = "Chức năng Phê duyệt bài viết chỉ dành riêng cho Marketing Manager!";
    }
    showToast(warningMsg, "warning");
    if (state.currentView !== "dashboard") {
      switchView("dashboard");
    }
    return;
  }

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

  // Ensure role permissions are applied to navigation and UI
  applyRolePermissionsUI(user);

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
    renderUsersTable();
  } else if (viewName === "statistics") {
    updateStatsPeriod();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
