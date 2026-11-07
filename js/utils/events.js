/**
 * Global Events, Keyboard Shortcuts, and App Handlers
 */
import { state } from '../core/state.js';
import { switchView } from '../core/router.js';
import { filterPosts } from '../views/postsView.js';
import { closeDeleteModal, closeRevisionModal, closeAddUserModal, closeSubmitApprovalModal } from '../components/modal.js';
import { closeAllDropdowns } from '../components/dropdown.js';
import { showToast } from '../components/toast.js';

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

export function handleLogout() {
  if (confirm("Bạn có muốn đăng xuất khỏi Blossom Beauty Store?")) {
    showToast("Đang đăng xuất khỏi hệ thống...", "info");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 400);
  }
}

export function showHelpModal() {
  showToast("Trung tâm hỗ trợ Blossom: Hotline 1900 8888 · support@blossom.vn", "info");
}
