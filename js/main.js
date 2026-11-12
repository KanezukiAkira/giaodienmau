/**
 * Blossom Beauty Store — Main Application Entry Point
 * ES Modules Architecture
 */

// Core & State
import { state, saveState, resetToFigmaDefaultData, exportDataJSON, syncDataFromBackend } from './core/state.js';
import { switchView } from './core/router.js';
import { switchUserRoleDemo, applyRolePermissionsUI, getCurrentUser } from './core/permissions.js';

// Components
import { showToast } from './components/toast.js';
import { toggleNotifDropdown, toggleUserDropdown, closeAllDropdowns } from './components/dropdown.js';
import {
  openDeleteModal,
  closeDeleteModal,
  confirmDeletePost,
  openRevisionModal,
  closeRevisionModal,
  selectRevisionDecision,
  submitRevisionFeedback,
  openSubmitApprovalModal,
  closeSubmitApprovalModal,
  confirmSubmitPostForApproval,
  openAddUserModal,
  closeAddUserModal,
  saveNewUser,
  openConfirmPublishModal,
  closeConfirmPublishModal,
  triggerAutoPublishFromModal,
  submitConfirmPublish,
  openMetricsModal,
  closeMetricsModal,
  submitManualMetrics,
  syncSocialMetrics,
  openChangePasswordModal,
  closeChangePasswordModal,
  submitChangePassword
} from './components/modal.js';
import { notificationsApi } from './api/notificationsApi.js';

// Views
import {
  renderKanbanBoard,
  setBoardTab,
  filterKanbanBoard,
  handleDragStart,
  handleDragOver,
  handleDrop,
  renderMemberProgressView,
  setupKanbanDragDrop
} from './views/dashboardView.js';

import {
  renderPostsTable,
  renderPostsRows,
  filterByTab,
  filterPosts,
  resetFilters,
  updateMetricsDisplay,
  handlePostTitleClick,
  handleAutoPublishNow
} from './views/postsView.js';

import {
  openCreatePost,
  openEditPost,
  savePostDraft,
  submitPostForApproval,
  commitPostSubmission,
  updateWordCount,
  updateChecklist,
  formatDoc,
  addLink,
  handleImageUpload,
  removeAttachedImage
} from './views/editorView.js';

import {
  renderCalendar,
  setCalendarMode,
  changeMonth,
  goToToday,
  createCalendarCell
} from './views/calendarView.js';

import {
  renderApprovalView,
  approveCurrentPost,
  downloadAttachmentSim
} from './views/approvalsView.js';

import {
  updateStatsPeriod,
  exportReportData,
  initChartTooltips
} from './views/statisticsView.js';

import {
  renderNotificationsList,
  filterNotifsByTab,
  handleNotifClick,
  markAllNotifsRead,
  updateNotifCounters
} from './views/notificationsView.js';

import {
  renderUsersTable,
  selectUserForDetail,
  filterUsersTable,
  updateSelectedUserRole,
  toggleUserLoginStatus,
  saveSelectedUserDetails,
  toggleLockSelectedUser,
  deleteSelectedUser
} from './views/usersView.js';

import {
  setupKeyboardShortcuts,
  handleGlobalSearch,
  handleLogout,
  handleAppLoginSubmit,
  toggleAppPasswordVisibility,
  showHelpModal,
  updateCurrentUserUI
} from './utils/events.js';

import { formatDateDisplay, escapeHTML } from './utils/formatters.js';

// Expose functions globally for inline HTML event handlers (e.g., onclick="switchView('posts')")
Object.assign(window, {
  // State & Data
  state,
  saveState,
  syncDataFromBackend,
  resetToFigmaDefaultData,
  exportDataJSON,

  // Router
  switchView,

  // Toast & Modals & Dropdowns
  showToast,
  toggleNotifDropdown,
  toggleUserDropdown,
  closeAllDropdowns,
  openDeleteModal,
  closeDeleteModal,
  confirmDeletePost,
  openRevisionModal,
  closeRevisionModal,
  selectRevisionDecision,
  submitRevisionFeedback,
  openSubmitApprovalModal,
  closeSubmitApprovalModal,
  confirmSubmitPostForApproval,
  openAddUserModal,
  closeAddUserModal,
  saveNewUser,
  openConfirmPublishModal,
  closeConfirmPublishModal,
  triggerAutoPublishFromModal,
  submitConfirmPublish,
  openMetricsModal,
  closeMetricsModal,
  submitManualMetrics,
  syncSocialMetrics,
  openChangePasswordModal,
  closeChangePasswordModal,
  submitChangePassword,

  // Dashboard / Kanban
  renderKanbanBoard,
  setBoardTab,
  filterKanbanBoard,
  handleDragStart,
  handleDragOver,
  handleDrop,
  renderMemberProgressView,

  // Posts
  renderPostsTable,
  renderPostsRows,
  filterByTab,
  filterPosts,
  resetFilters,
  updateMetricsDisplay,
  handlePostTitleClick,
  handleAutoPublishNow,

  // Editor
  openCreatePost,
  openEditPost,
  savePostDraft,
  submitPostForApproval,
  commitPostSubmission,
  updateWordCount,
  updateChecklist,
  formatDoc,
  addLink,
  handleImageUpload,
  removeAttachedImage,

  // Calendar
  renderCalendar,
  setCalendarMode,
  changeMonth,
  goToToday,
  createCalendarCell,

  // Approvals
  renderApprovalView,
  approveCurrentPost,
  downloadAttachmentSim,

  // Statistics
  updateStatsPeriod,
  exportReportData,
  initChartTooltips,

  // Notifications
  renderNotificationsList,
  filterNotifsByTab,
  handleNotifClick,
  markAllNotifsRead,
  updateNotifCounters,

  // Users
  renderUsersTable,
  selectUserForDetail,
  filterUsersTable,
  updateSelectedUserRole,
  toggleUserLoginStatus,
  saveSelectedUserDetails,
  toggleLockSelectedUser,
  deleteSelectedUser,

  // Events & Global utilities
  setupKeyboardShortcuts,
  handleGlobalSearch,
  handleLogout,
  openChangePasswordModal,
  handleAppLoginSubmit,
  toggleAppPasswordVisibility,
  showHelpModal,
  formatDateDisplay,
  escapeHTML,

  // RBAC & Role Management
  switchUserRoleDemo,
  applyRolePermissionsUI
});

// Global click to close popovers
document.addEventListener("click", closeAllDropdowns);

// App Bootstrap
function initApp() {
  const initialUser = getCurrentUser();
  if (initialUser && initialUser.role_code) {
    applyRolePermissionsUI(initialUser);
  }

  renderKanbanBoard();
  renderPostsTable();
  updateMetricsDisplay();
  renderCalendar();
  renderApprovalView(state.activeApprovalPostId);
  renderNotificationsList();
  renderUsersTable();
  updateNotifCounters();
  setupKeyboardShortcuts();
  setupKanbanDragDrop();
  initChartTooltips();

  // Authentication check: If not logged in, show Login view first ()
  const isLoggedIn = (typeof sessionStorage !== "undefined") && sessionStorage.getItem("blossom_logged_in") === "true";
  if (!isLoggedIn) {
    switchView("login");
  } else {
    try {
      const savedUser = getCurrentUser();
      if (savedUser && savedUser.role_code) {
        updateCurrentUserUI(savedUser);
        applyRolePermissionsUI(savedUser);
      }
    } catch {}
    switchView("dashboard");
    syncDataFromBackend();

    // Connect WebSocket for real-time live notifications (Backend FR-12)
    try {
      const token = (typeof localStorage !== "undefined" && localStorage.getItem("blossom_access_token")) ||
                    (typeof sessionStorage !== "undefined" && sessionStorage.getItem("blossom_access_token"));
      if (token) {
        notificationsApi.connectWebSocket(
          token,
          (msg) => {
            const title = (msg && typeof msg === "object") ? msg.title : "Thông báo mới";
            const body = (msg && typeof msg === "object") ? msg.message : String(msg);
            showToast(`🔔 ${title}: ${body}`, "info");
            syncDataFromBackend();
          },
          (err) => console.log("WS info:", err),
          () => console.log("WS closed")
        );
      }
    } catch (e) {
      console.warn("WebSocket init warning:", e);
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
