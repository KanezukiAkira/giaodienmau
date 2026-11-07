/**
 * Modals Controller (Figma FR-06, FR-08, FR-10)
 */
import { state, saveState } from '../core/state.js';
import { showToast } from './toast.js';

// --- FR-06: Delete Confirmation Modal ---
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

export function confirmDeletePost() {
  if (!state.deleteTargetPostId) return;

  const postId = state.deleteTargetPostId;
  const idx = state.posts.findIndex(p => p.id === postId);
  if (idx !== -1) {
    const deleted = state.posts.splice(idx, 1)[0];
    saveState();
    closeDeleteModal();
    if (window.renderPostsTable) window.renderPostsTable();
    showToast(`Đã xóa bài viết ${deleted.id} thành công!`, "info");
  }
}

// --- FR-10: Revision / Rejection Modal ---
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

export function submitRevisionFeedback() {
  const feedback = document.getElementById("revisionFeedbackText")?.value.trim() || "";
  const post = state.posts.find(p => p.id === state.activeApprovalPostId);
  if (!post) return;

  const isReject = state.revisionDecisionType === "reject";
  post.status = isReject ? "archived" : "revising";
  post.statusText = isReject ? "Đã từ chối" : "Đang chỉnh sửa";
  post.revisionFeedback = feedback;

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

// --- FR-08: Submit for Approval Modal ---
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

// --- FR-03: Add User Modal ---
export function openAddUserModal() {
  document.getElementById("addUserModal")?.classList.add("show");
}

export function closeAddUserModal() {
  document.getElementById("addUserModal")?.classList.remove("show");
}

export function saveNewUser() {
  const name = document.getElementById("newUserName")?.value.trim() || "";
  const email = document.getElementById("newUserEmail")?.value.trim() || "";
  const role = document.getElementById("newUserRole")?.value || "Biên tập viên";

  if (!name || !email) {
    showToast("Vui lòng điền họ tên và email!", "error");
    return;
  }

  const initials = name.split(" ").map(w => w[0]).slice(-2).join("").toUpperCase();
  const newUser = {
    id: state.users.length + 1,
    name,
    email,
    role,
    postCount: 0,
    status: "Hoạt động",
    avatar: initials || "US"
  };

  state.users.push(newUser);
  saveState();
  closeAddUserModal();
  if (window.renderUsersTable) window.renderUsersTable();
  showToast(`Đã thêm thành viên ${name} (${role}) thành công!`, "success");
}
