/**
 * Global Events, Keyboard Shortcuts, and App Handlers
 */
import { state } from '../core/state.js';
import { switchView } from '../core/router.js';
import { filterPosts } from '../views/postsView.js';
import { closeDeleteModal, closeRevisionModal, closeAddUserModal, closeSubmitApprovalModal } from '../components/modal.js';
import { closeAllDropdowns } from '../components/dropdown.js';
import { showToast } from '../components/toast.js';
import { authApi } from '../api/authApi.js';

export function updateCurrentUserUI(user) {
  if (!user) return;
  const nameEl = document.querySelector(".current-user .identity .name");
  const roleEl = document.querySelector(".current-user .identity .role");
  const avatarEl = document.querySelector(".current-user .avatar");
  const ddName = document.querySelector(".user-dropdown-name");
  const ddEmail = document.querySelector(".user-dropdown-email");
  const ddRole = document.querySelector(".user-dropdown-role");

  if (nameEl) nameEl.textContent = user.full_name || user.username;
  if (roleEl) roleEl.textContent = user.role_name || user.role_code;
  if (avatarEl) {
    const words = (user.full_name || user.username).trim().split(/\s+/);
    const initials = words.length >= 2 ? words[0][0] + words[words.length - 1][0] : (words[0] ? words[0].slice(0, 2) : "BL");
    avatarEl.textContent = initials.toUpperCase();
  }
  if (ddName) ddName.textContent = user.full_name || user.username;
  if (ddEmail) ddEmail.textContent = user.email || "";
  if (ddRole) ddRole.textContent = `${user.role_name || user.role_code} · ${user.status || 'ACTIVE'}`;
}

export function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // ⌘ K or Ctrl + K for search
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      const input = document.getElementById("globalSearchInput");
      if (input) {
        input.focus();
        input.select();
      }
    }
    // Escape closes modals and dropdowns
    if (e.key === "Escape") {
      closeDeleteModal();
      closeRevisionModal();
      closeAddUserModal();
      closeSubmitApprovalModal();
      closeAllDropdowns();
    }
  });
}

export function handleGlobalSearch(term) {
  if (!term.trim()) return;
  if (state.currentView !== "posts") {
    switchView("posts");
  }
  const searchInput = document.getElementById("postFilterSearch");
  if (searchInput) {
    searchInput.value = term;
    filterPosts();
  }
}

export async function handleAppLoginSubmit(e) {
  if (e) e.preventDefault();
  const btn = document.getElementById("btnSubmitAppLogin");
  const emailInput = document.getElementById("appLoginEmail");
  const passInput = document.getElementById("appLoginPassword");
  const rememberInput = document.getElementById("appRememberMe");

  const usernameOrEmail = (emailInput?.value || "").trim();
  const password = passInput?.value || "";
  const remember = rememberInput ? rememberInput.checked : true;

  if (!usernameOrEmail || !password) {
    showToast("Vui lòng nhập đầy đủ email và mật khẩu", "danger");
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>Đang xác thực với máy chủ...</span>';
  }

  try {
    // 1. Gọi trực tiếp API Backend FastAPI
    const resp = await authApi.login(usernameOrEmail, password, remember);

    // 2. Cập nhật giao diện người dùng
    if (resp && resp.user) {
      updateCurrentUserUI(resp.user);
    }

    sessionStorage.setItem("blossom_logged_in", "true");
    showToast(`Đăng nhập thành công! Chào mừng ${resp.user?.full_name || usernameOrEmail}`, "success");

    // 3. Tải và đồng bộ dữ liệu thật từ Backend
    if (window.syncDataFromBackend) {
      await window.syncDataFromBackend();
    }

    switchView("dashboard");
  } catch (err) {
    console.warn("Login API error:", err);
    // Nếu có mã lỗi HTTP từ Backend (401, 403, 422)
    if (err.status && err.status >= 400 && err.status < 500) {
      showToast(err.message || "Tài khoản hoặc mật khẩu không chính xác!", "danger");
    } else {
      // Fallback chế độ offline mock nếu server FastAPI chưa bật
      sessionStorage.setItem("blossom_logged_in", "true");
      showToast("Chế độ Offline Mock (Máy chủ Backend chưa phản hồi)", "warning");
      switchView("dashboard");
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg><span>Đăng nhập</span>';
    }
  }
}

export function toggleAppPasswordVisibility() {
  const pwd = document.getElementById("appLoginPassword");
  const eye = document.getElementById("appEyeIcon");
  if (!pwd || !eye) return;
  if (pwd.type === "password") {
    pwd.type = "text";
    eye.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
  } else {
    pwd.type = "password";
    eye.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
  }
}

export async function handleLogout() {
  if (confirm("Bạn có muốn đăng xuất khỏi Blossom Beauty Store?")) {
    try {
      await authApi.logout();
    } catch (e) {
      console.warn("Logout error:", e);
    }
    sessionStorage.removeItem("blossom_logged_in");
    localStorage.removeItem("blossom_current_user");
    showToast("Đã đăng xuất tài khoản", "info");
    switchView("login");
  }
}

export function showHelpModal() {
  showToast("Trung tâm hỗ trợ Blossom: Hotline 1900 8888 · support@blossom.vn", "info");
}
