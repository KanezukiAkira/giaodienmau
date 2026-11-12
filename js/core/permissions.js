/**
 * Core Permission & RBAC Engine (MOD-02 / SDD v1.1)
 * Role-Based Access Control for Manager vs Staff
 */
import { ROLES, STORAGE_KEYS } from '../constants/enums.js';
import { showToast } from '../components/toast.js';

/**
 * Get currently logged-in user object from localStorage
 */
export function getCurrentUser() {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEYS.USER_INFO) : null;
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Check if the user is a Marketing Manager (Quản lý)
 */
export function isManager(user = getCurrentUser()) {
  if (!user) return false;
  return user.role_code === ROLES.MANAGER || user.role_id === 1;
}

/**
 * Check if the user is a Marketing Staff (Nhân viên / Biên tập viên)
 */
export function isStaff(user = getCurrentUser()) {
  if (!user) return false;
  return user.role_code === ROLES.STAFF || user.role_id === 2;
}

/**
 * Determine if current user can navigate to a specific view
 */
export function canAccessView(viewName, user = getCurrentUser()) {
  if (isStaff(user)) {
    // Staff is NOT permitted to access Manager-only views
    if (viewName === "users" || viewName === "statistics" || viewName === "approvals") {
      return false;
    }
  }
  return true;
}

/**
 * Determine if current user can edit a given post
 * - Manager: Can edit all posts in editable states (or all posts)
 * - Staff: Can ONLY edit their own posts in DRAFT, REVISING, or REJECTED states
 */
export function canEditPost(post, user = getCurrentUser()) {
  if (!post) return false;
  if (isManager(user)) return true;
  if (isStaff(user)) {
    const isOwner = Boolean(
      (post.authorId && user.user_id && post.authorId === user.user_id) ||
      (user.full_name && post.author && post.author.includes(user.full_name)) ||
      (user.username && post.author && post.author.toLowerCase().includes(user.username.toLowerCase())) ||
      post.isMine
    );
    const isEditableStatus = post.status === "draft" || post.status === "revising" || post.status === "rejected";
    return isOwner && isEditableStatus;
  }
  return true;
}

/**
 * Determine if current user can delete a given post
 * - Manager: Can delete any DRAFT or REJECTED post
 * - Staff: Can ONLY delete their OWN post in DRAFT or REJECTED status
 */
export function canDeletePost(post, user = getCurrentUser()) {
  if (!post) return false;
  const isDeletableStatus = post.status === "draft" || post.status === "rejected";
  if (!isDeletableStatus) return false;

  if (isManager(user)) return true;
  if (isStaff(user)) {
    const isOwner = Boolean(
      (post.authorId && user.user_id && post.authorId === user.user_id) ||
      (user.full_name && post.author && post.author.includes(user.full_name)) ||
      (user.username && post.author && post.author.toLowerCase().includes(user.username.toLowerCase())) ||
      post.isMine
    );
    return isOwner;
  }
  return true;
}

/**
 * Apply role-based visibility to Frontend DOM elements
 * Hides/displays features according to user role
 */
export function applyRolePermissionsUI(user = getCurrentUser()) {
  const staff = isStaff(user);
  const manager = isManager(user);

  // 1. Sidebar Navigation Menu Items
  const navApprovals = document.getElementById("navItemApprovals");
  const navStats = document.getElementById("navItemStatistics");
  const navUsers = document.getElementById("navItemUsers");

  if (navApprovals) navApprovals.style.display = staff ? "none" : "";
  if (navStats) navStats.style.display = staff ? "none" : "";
  if (navUsers) navUsers.style.display = staff ? "none" : "";

  // 2. Dashboard - Member Progress Tab (Theo dõi thành viên)
  const memberTab = document.getElementById("btnKanbanMemberTab");
  if (memberTab) {
    memberTab.style.display = staff ? "none" : "";
  }

  // 3. User Dropdown - Profile link to User & RBAC Management
  const dropdownProfile = document.getElementById("dropdownItemProfile");
  if (dropdownProfile) {
    dropdownProfile.style.display = staff ? "none" : "";
  }

  // 4. Approvals View Actions (Chỉ Manager mới có các nút Duyệt / Yêu cầu sửa)
  const approvalActions = document.getElementById("approvalActionGroup");
  if (approvalActions) {
    approvalActions.style.display = staff ? "none" : "";
  }

  // 5. Update Role Tag in Sidebar/Header
  const roleEl = document.querySelector(".current-user .identity .role");
  if (roleEl) {
    roleEl.textContent = manager ? "Marketing Manager" : (staff ? "Marketing Staff" : (user.role_name || "Thành viên"));
  }

  // 6. Update Demo Role Switcher Buttons UI
  const btnMgr = document.getElementById("btnSwitchManager");
  const btnStf = document.getElementById("btnSwitchStaff");
  if (btnMgr) {
    if (manager) {
      btnMgr.style.backgroundColor = "#cc618a";
      btnMgr.style.color = "#ffffff";
      btnMgr.style.fontWeight = "600";
    } else {
      btnMgr.style.backgroundColor = "";
      btnMgr.style.color = "";
      btnMgr.style.fontWeight = "";
    }
  }
  if (btnStf) {
    if (staff) {
      btnStf.style.backgroundColor = "#cc618a";
      btnStf.style.color = "#ffffff";
      btnStf.style.fontWeight = "600";
    } else {
      btnStf.style.backgroundColor = "";
      btnStf.style.color = "";
      btnStf.style.fontWeight = "";
    }
  }
}

/**
 * Interactive Demo Role Switcher for instant testing on FE
 */
export function switchUserRoleDemo(targetRole) {
  const users = {
    MANAGER: {
      user_id: 1,
      username: "manager",
      email: "manager@rikkeilab.vn",
      full_name: "Doãn Thị Minh Anh (Manager)",
      role_code: "MANAGER",
      role_name: "Marketing Manager",
      status: "ACTIVE"
    },
    STAFF: {
      user_id: 2,
      username: "staff1",
      email: "staff1@rikkeilab.vn",
      full_name: "Trịnh Trần Công Huy (Staff)",
      role_code: "STAFF",
      role_name: "Marketing Staff",
      status: "ACTIVE"
    }
  };

  const newUser = users[targetRole] || users.MANAGER;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(newUser));
  } catch (e) {
    console.warn("Role switch storage warning:", e);
  }

  if (window.updateCurrentUserUI) {
    window.updateCurrentUserUI(newUser);
  }
  applyRolePermissionsUI(newUser);

  // If currently on a view that Staff cannot access, switch back to dashboard
  if (targetRole === "STAFF") {
    const currentView = window.state?.currentView;
    if (currentView === "users" || currentView === "statistics" || currentView === "approvals") {
      if (window.switchView) window.switchView("dashboard");
    }
  }

  // Re-render views with new role permissions
  if (window.renderPostsTable) window.renderPostsTable();
  if (window.renderKanbanBoard) window.renderKanbanBoard();
  if (window.updateMetricsDisplay) window.updateMetricsDisplay();

  const roleTitle = targetRole === "MANAGER" ? "Marketing Manager (Quản lý - Toàn quyền)" : "Marketing Staff (Nhân viên - Chỉ tính năng được phép)";
  showToast(`Đã chuyển đổi giao diện sang vai trò: ${roleTitle}`, "info");
}
