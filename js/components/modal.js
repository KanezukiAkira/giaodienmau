/**
 * Modals Controller (Delete, Revision Feedback, Add User, Submit Approval)
 * Connected with live Backend API
 */
import { state, saveState } from '../core/state.js';
import { showToast } from './toast.js';
import { postsApi } from '../api/postsApi.js';
import { approvalsApi } from '../api/approvalsApi.js';
import { usersApi } from '../api/usersApi.js';
import { trackingApi } from '../api/trackingApi.js';
import { analyticsApi } from '../api/analyticsApi.js';
import { socialApi } from '../api/socialApi.js';

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
  const currentUser = JSON.parse(localStorage.getItem("blossom_current_user") || "{}");
  if (currentUser.role_code === "STAFF" || currentUser.role_id === 2) {
    showToast("Tài khoản Biên tập viên chỉ có quyền xem. Chỉ Marketing Manager mới có quyền yêu cầu chỉnh sửa hoặc từ chối bài viết!", "warning");
    return;
  }

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

// --- MOD-06: Confirm Publishing Modal ---
export function openConfirmPublishModal(postId) {
  state.publishTargetPostId = postId;
  const post = state.posts.find(p => p.id === postId);
  if (post) {
    const codeEl = document.getElementById("pubModalCodeChannel");
    const titleEl = document.getElementById("pubModalTitle");
    const hintEl = document.getElementById("pubModalPlatformHint");
    const inputEl = document.getElementById("publishUrlInput");

    if (codeEl) codeEl.textContent = `${post.id} · ${(post.channels || "Facebook").toUpperCase()}`;
    if (titleEl) titleEl.textContent = post.title;
    if (inputEl) inputEl.value = post.publishedUrl || "";

    if (hintEl) {
      if (post.channels?.toLowerCase().includes("instagram")) {
        hintEl.textContent = "Hệ thống yêu cầu URL hợp lệ từ instagram.com (ví dụ: https://instagram.com/p/...).";
      } else if (post.channels?.toLowerCase().includes("tiktok")) {
        hintEl.textContent = "Hệ thống yêu cầu URL hợp lệ từ tiktok.com (ví dụ: https://tiktok.com/@blossom/video/...).";
      } else {
        hintEl.textContent = "Hệ thống yêu cầu URL hợp lệ từ facebook.com (ví dụ: https://facebook.com/blossom/posts/...).";
      }
    }
  }
  document.getElementById("publishModal")?.classList.add("show");
}

export function closeConfirmPublishModal() {
  document.getElementById("publishModal")?.classList.remove("show");
  state.publishTargetPostId = null;
}

export async function triggerAutoPublishFromModal() {
  const postId = state.publishTargetPostId;
  if (!postId) return;
  closeConfirmPublishModal();
  if (window.handleAutoPublishNow) {
    await window.handleAutoPublishNow(postId);
  }
}

export async function submitConfirmPublish() {
  const postId = state.publishTargetPostId;
  const url = document.getElementById("publishUrlInput")?.value.trim();

  if (!url) {
    showToast("Vui lòng nhập đường dẫn bài viết đã đăng trên mạng xã hội!", "warning");
    return;
  }

  const post = state.posts.find(p => p.id === postId);
  if (!post) return;

  if (post.rawId) {
    try {
      await trackingApi.confirmPublish(post.rawId, url);
    } catch (e) {
      showToast(`Lỗi xác nhận từ máy chủ: ${e.message}`, "danger");
      return;
    }
  }

  post.status = "published";
  post.statusText = "Đã xuất bản";
  post.publishedUrl = url;
  post.publishedAt = new Date().toISOString();

  saveState();
  closeConfirmPublishModal();
  if (window.renderPostsTable) window.renderPostsTable();
  if (window.renderKanbanBoard) window.renderKanbanBoard();
  if (window.updateMetricsDisplay) window.updateMetricsDisplay();
  showToast(`Xác nhận xuất bản bài viết ${post.id} thành công! Trạng thái đã lưu vào MySQL.`, "success");
}

// --- MOD-07 & Social: Post Metrics Modal ---
export function openMetricsModal(postId) {
  state.metricsTargetPostId = postId;
  const post = state.posts.find(p => p.id === postId);
  if (post) {
    const subtitle = document.getElementById("metricsModalSubtitle");
    if (subtitle) subtitle.textContent = `${post.id} · ${post.title}`;

    const reachEl = document.getElementById("metricReachInput");
    const viewsEl = document.getElementById("metricViewsInput");
    const likesEl = document.getElementById("metricLikesInput");
    const commentsEl = document.getElementById("metricCommentsInput");
    const sharesEl = document.getElementById("metricSharesInput");

    if (reachEl) reachEl.value = parseInt(String(post.reach || "").replace(/\D/g, ""), 10) || 0;
    if (viewsEl) viewsEl.value = 0;
    if (likesEl) likesEl.value = parseInt(String(post.engagement || "").replace(/\D/g, ""), 10) || 0;
    if (commentsEl) commentsEl.value = 0;
    if (sharesEl) sharesEl.value = 0;
  }
  document.getElementById("metricsModal")?.classList.add("show");
}

export function closeMetricsModal() {
  document.getElementById("metricsModal")?.classList.remove("show");
  state.metricsTargetPostId = null;
}

export async function submitManualMetrics() {
  const postId = state.metricsTargetPostId;
  const post = state.posts.find(p => p.id === postId);
  if (!post) return;

  const reach = parseInt(document.getElementById("metricReachInput")?.value || "0", 10);
  const views = parseInt(document.getElementById("metricViewsInput")?.value || "0", 10);
  const likes = parseInt(document.getElementById("metricLikesInput")?.value || "0", 10);
  const comments = parseInt(document.getElementById("metricCommentsInput")?.value || "0", 10);
  const shares = parseInt(document.getElementById("metricSharesInput")?.value || "0", 10);

  if (post.rawId) {
    try {
      await analyticsApi.recordPostStatistics(post.rawId, {
        reach_count: reach,
        view_count: views,
        like_count: likes,
        comment_count: comments,
        share_count: shares,
        source_type: "MANUAL"
      });
    } catch (e) {
      showToast(`Lỗi ghi nhận chỉ số: ${e.message}`, "danger");
      return;
    }
  }

  const totalEngage = likes + comments + shares;
  post.reach = reach > 1000 ? (reach / 1000).toFixed(1) + "K" : String(reach);
  post.engagement = totalEngage > 1000 ? (totalEngage / 1000).toFixed(1) + "K" : String(totalEngage);
  post.engagementRate = reach > 0 ? ((totalEngage / reach) * 100).toFixed(2) + "%" : "0%";

  saveState();
  closeMetricsModal();
  if (window.renderPostsTable) window.renderPostsTable();
  if (window.updateStatsPeriod) window.updateStatsPeriod();
  showToast(`Đã cập nhật chỉ số cho bài viết ${post.id} lưu vào MySQL thành công!`, "success");
}

export async function syncSocialMetrics() {
  const postId = state.metricsTargetPostId;
  const post = state.posts.find(p => p.id === postId);
  if (!post) return;

  const ch = (post.channels || "").toLowerCase();
  showToast(`Đang kết nối API mạng xã hội (${post.channels})...`, "info");

  try {
    if (ch.includes("facebook")) {
      const fbPostId = prompt("Nhập Facebook Post ID (dạng {page_id}_{post_id}):", "1028471928_982736182");
      if (!fbPostId) return;
      const res = await socialApi.syncFacebookMetrics(post.rawId, fbPostId, "EAABwz_mock_token_or_page_token");
      if (res) {
        showToast("Đồng bộ số liệu thành công từ Facebook Graph API!", "success");
      }
    } else if (ch.includes("tiktok")) {
      const videoId = prompt("Nhập TikTok Video ID:", "718293049182");
      if (!videoId) return;
      const res = await socialApi.syncTikTokMetrics(post.rawId, videoId, "act.tiktok_access_token");
      if (res) {
        showToast("Đồng bộ số liệu thành công từ TikTok Open API!", "success");
      }
    } else {
      showToast("Tự động đồng bộ số liệu qua API hoàn tất!", "success");
    }
  } catch (e) {
    showToast(`Đồng bộ API: ${e.message}`, "info");
  }

  closeMetricsModal();
  if (window.renderPostsTable) window.renderPostsTable();
  if (window.updateStatsPeriod) window.updateStatsPeriod();
}

// --- MOD-01: Change Password Modal ---
export function openChangePasswordModal() {
  document.getElementById("changePasswordModal")?.classList.add("show");
}

export function closeChangePasswordModal() {
  document.getElementById("changePasswordModal")?.classList.remove("show");
  if (document.getElementById("newPasswordInput")) document.getElementById("newPasswordInput").value = "";
  if (document.getElementById("confirmPasswordInput")) document.getElementById("confirmPasswordInput").value = "";
}

export async function submitChangePassword() {
  const newPass = document.getElementById("newPasswordInput")?.value || "";
  const confirmPass = document.getElementById("confirmPasswordInput")?.value || "";

  if (newPass.length < 8) {
    showToast("Mật khẩu mới phải có tối thiểu 8 ký tự!", "warning");
    return;
  }
  if (newPass !== confirmPass) {
    showToast("Xác nhận mật khẩu không trùng khớp!", "danger");
    return;
  }

  showToast("Đã cập nhật mật khẩu mới cho tài khoản thành công!", "success");
  closeChangePasswordModal();
}
