/**
 * Modals Controller (Delete, Revision Feedback, Add User, Submit Approval)
 * Connected with live Backend API
 */
import { state, saveState } from '../core/state.js';
import { showToast } from './toast.js';
import { postsApi } from '../api/postsApi.js';
import { approvalsApi } from '../api/approvalsApi.js';
import { usersApi } from '../api/usersApi.js';

// --- Delete Confirmation Modal ---
export function openDeleteModal(postId) {
  state.deleteTargetPostId = postId;
  const post = state.posts.find(p => p.id === postId);
  if (post) {
    const codeStatusEl = document.getElementById("deletePostCodeStatus");
    const titleEl = document.getElementById("deletePostTitleDisplay");
    const metaEl = document.getElementById("deletePostMetaDisplay");

    if (codeStatusEl) {
      codeStatusEl.textContent = `${post.id} · ${post.status === 'draft' ? 'BẢN NHÁP' : post.statusText.toUpperCase()}`;
    }
    if (titleEl) {
      titleEl.textContent = post.title;
    }
    if (metaEl) {
      metaEl.textContent = `${post.author} · Cập nhật ${post.displayDate}`;
    }
  }
  document.getElementById("deleteModal")?.classList.add("show");
}

export function closeDeleteModal() {
  document.getElementById("deleteModal")?.classList.remove("show");
  state.deleteTargetPostId = null;
}

export async function confirmDeletePost() {
  if (!state.deleteTargetPostId) return;

  const postId = state.deleteTargetPostId;
  const post = state.posts.find(p => p.id === postId);

  if (post && post.rawId) {
    try {
      await postsApi.deletePost(post.rawId);
    } catch (e) {
      console.warn("Backend deletePost warning:", e.message);
    }
  }

  const idx = state.posts.findIndex(p => p.id === postId);
  if (idx !== -1) {
    state.posts.splice(idx, 1);
  }

  saveState();
  closeDeleteModal();
  if (window.renderPostsTable) window.renderPostsTable();
  showToast(`Đã xóa bài viết ${postId} khỏi hệ thống!`, "info");
}

// --- Revision / Rejection Modal ---
export function openRevisionModal() {
  const post = state.posts.find(p => p.id === state.activeApprovalPostId) || state.posts[0];
  if (post) {
    const codeAuthorEl = document.getElementById("revisionPostCodeAuthor");
    const titleEl = document.getElementById("revisionPostTitleDisplay");
    if (codeAuthorEl) codeAuthorEl.textContent = `${post.id} · ${post.author.toUpperCase()}`;
    if (titleEl) titleEl.textContent = post.title;
  }
  document.getElementById("revisionModal")?.classList.add("show");
}

export function closeRevisionModal() {
  document.getElementById("revisionModal")?.classList.remove("show");
}

export function selectRevisionDecision(type) {
  state.revisionDecisionType = type;
  document.getElementById("decisionPillRevise")?.classList.toggle("active", type === "revise");
  document.getElementById("decisionPillReject")?.classList.toggle("active", type === "reject");
}

export async function submitRevisionFeedback() {
  const feedback = document.getElementById("revisionFeedbackText")?.value.trim() || "";
  const post = state.posts.find(p => p.id === state.activeApprovalPostId) || state.posts[0];
  if (!post) return;

  const isReject = state.revisionDecisionType === "reject";
  post.status = isReject ? "archived" : "revising";
  post.statusText = isReject ? "Đã từ chối" : "Đang chỉnh sửa";
  post.revisionFeedback = feedback;

  if (post.rawId) {
    try {
      await approvalsApi.rejectPost(post.rawId, {
        action: isReject ? "REJECTED" : "REVISION_REQUESTED",
        comment: feedback || (isReject ? "Từ chối bài viết" : "Yêu cầu chỉnh sửa nội dung")
      });
    } catch (e) {
      console.warn("Backend reject/revision warning:", e.message);
    }
  }

  state.notifications.unshift({
    id: Date.now(),
    title: isReject ? `Đã từ chối bài viết ${post.id}` : `Yêu cầu chỉnh sửa bài viết ${post.id}`,
    desc: `Quản trị viên đã gửi phản hồi: "${feedback || 'Cần hoàn thiện nội dung'}"`,
    time: "Vừa xong",
    unread: true,
    targetView: "posts"
  });

  saveState();
  closeRevisionModal();
  if (window.renderApprovalView) window.renderApprovalView(post.id);
  showToast(isReject ? `Đã từ chối bài viết ${post.id}!` : `Đã gửi yêu cầu chỉnh sửa bài viết ${post.id} tới tác giả!`, "info");
}

// --- Submit for Approval Modal ---
export function openSubmitApprovalModal() {
  document.getElementById("submitApprovalModal")?.classList.add("show");
}

export function closeSubmitApprovalModal() {
  document.getElementById("submitApprovalModal")?.classList.remove("show");
}

export function confirmSubmitPostForApproval() {
  closeSubmitApprovalModal();
  if (window.commitPostSubmission) {
    window.commitPostSubmission();
  }
}

// --- Add User Modal ---
export function openAddUserModal() {
  document.getElementById("addUserModal")?.classList.add("show");
}

export function closeAddUserModal() {
  document.getElementById("addUserModal")?.classList.remove("show");
}

export async function saveNewUser() {
  const name = document.getElementById("newUserName")?.value.trim() || "";
  const email = document.getElementById("newUserEmail")?.value.trim() || "";
  const roleSelect = document.getElementById("newUserRole")?.value || "Biên tập viên";

  if (!name || !email) {
    showToast("Vui lòng điền họ tên và email!", "danger");
    return;
  }

  const roleId = roleSelect.includes("Quản lý") ? 1 : 2;
  const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, '');

  let rawId = null;
  try {
    const createdUser = await usersApi.createUser({
      username: username || `user_${Date.now()}`,
      email: email,
      full_name: name,
      password: "User@123",
      role_id: roleId
    });
    if (createdUser && createdUser.user_id) {
      rawId = createdUser.user_id;
    }
  } catch (err) {
    console.warn("Backend createUser warning:", err.message);
  }

  const initials = name.split(" ").map(w => w[0]).slice(-2).join("").toUpperCase();
  const newUser = {
    id: rawId || (state.users.length + 1),
    rawId: rawId,
    name,
    email,
    role: roleId === 1 ? "Quản lý" : "Biên tập viên",
    postCount: 0,
    status: "Hoạt động",
    canLogin: true,
    isLocked: false,
    avatar: initials || "US",
    lastLogin: "Vừa tạo"
  };

  state.users.push(newUser);
  saveState();
  closeAddUserModal();
  if (window.renderUsersTable) window.renderUsersTable();
  showToast(`Đã thêm thành viên ${name} (${roleSelect}) lưu vào máy chủ MySQL thành công!`, "success");
}
