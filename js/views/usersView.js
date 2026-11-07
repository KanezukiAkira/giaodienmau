/**
 * View: User Management & Permissions (Figma FR-03)
 */
import { state, saveState } from '../core/state.js';
import { escapeHTML } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';

let selectedUserId = 2; // Default selected: Trần Ngọc Mai (ID 2)

export function renderUsersTable() {
  const tbody = document.getElementById("usersTableBody");
  if (!tbody) return;

  const searchTerm = (document.getElementById("userFilterSearch")?.value || "").toLowerCase().trim();
  const roleFilter = document.getElementById("userFilterRole")?.value || "";
  const statusFilter = document.getElementById("userFilterStatus")?.value || "";

  const filtered = state.users.filter(user => {
    if (searchTerm) {
      const matchName = user.name.toLowerCase().includes(searchTerm);
      const matchEmail = (user.email || "").toLowerCase().includes(searchTerm);
      if (!matchName && !matchEmail) return false;
    }
    if (roleFilter && user.role !== roleFilter) return false;
    if (statusFilter && user.status !== statusFilter) return false;
    return true;
  });

  tbody.innerHTML = "";

  // Update counter badges
  const totalBadge = document.getElementById("accountTotalBadge");
  if (totalBadge) totalBadge.textContent = `${state.users.length} thành viên`;

  const elTotal = document.getElementById("userMetricTotal");
  const elActive = document.getElementById("userMetricActive");
  const elLocked = document.getElementById("userMetricLocked");

  if (elTotal) elTotal.textContent = String(state.users.length).padStart(2, "0");
  if (elActive) elActive.textContent = String(state.users.filter(u => u.status === "Hoạt động").length).padStart(2, "0");
  if (elLocked) elLocked.textContent = String(state.users.filter(u => u.status === "Đã khóa").length).padStart(2, "0");

  filtered.forEach(user => {
    const isSelected = user.id === selectedUserId;
    const tr = document.createElement("tr");
    if (isSelected) tr.style.backgroundColor = "#fff8fa";

    const lastLogin = user.lastLogin || "Hôm nay, 09:30";
    const isLocked = user.status === "Đã khóa";

    tr.innerHTML = `
      <td>
        <div style="display: flex; align-items: center; gap: 10px;">
          <input type="checkbox" ${isSelected ? "checked" : ""} style="accent-color: #cc618a; cursor: pointer;">
          <div class="avatar avatar-sm" style="width: 28px; height: 28px; font-size: 10px; background: #f9dfe9; color: #cc618a; font-weight: 600;">${user.avatar}</div>
          <div class="post-text-meta">
            <strong style="cursor: pointer;" onclick="window.selectUserForDetail(${user.id})">${escapeHTML(user.name)}</strong>
            <span style="font-size: 9px; color: #a4989d;">${escapeHTML(user.email)}</span>
          </div>
        </div>
      </td>
      <td><span style="color: #cc618a; font-weight: 500; font-size: 11px;">${user.role}</span></td>
      <td>
        <span class="badge ${isLocked ? 'badge-draft' : 'badge-published'}" style="${isLocked ? 'background: #fdedf2; color: #cc618a;' : 'background: #ebf6ef; color: #69a68e;'}">
          ${user.status}
        </span>
      </td>
      <td style="font-size: 10px; color: #a4989d;">${lastLogin}</td>
      <td style="text-align: right;">
        <button class="action-icon-btn" onclick="window.selectUserForDetail(${user.id})" title="Chỉnh sửa tài khoản">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  renderSelectedUserDetail();
}

export function filterUsersTable() {
  renderUsersTable();
}

export function selectUserForDetail(userId) {
  selectedUserId = userId;
  renderUsersTable();
}

function renderSelectedUserDetail() {
  const user = state.users.find(u => u.id === selectedUserId) || state.users[0];
  if (!user) return;

  const elAvatar = document.getElementById("detailUserAvatar");
  const elName = document.getElementById("detailUserName");
  const elEmail = document.getElementById("detailUserEmail");
  const elRole = document.getElementById("detailUserRoleSelect");
  const elRoleDesc = document.getElementById("detailUserRoleDesc");
  const elToggle = document.getElementById("detailUserLoginToggle");

  if (elAvatar) elAvatar.textContent = user.avatar;
  if (elName) elName.textContent = user.name;
  if (elEmail) elEmail.textContent = user.email;
  if (elRole) elRole.value = user.role;

  if (elRoleDesc) {
    if (user.role === "Quản trị viên") {
      elRoleDesc.textContent = "Toàn quyền quản trị hệ thống, quản lý tài khoản, phê duyệt và cài đặt hệ thống.";
    } else if (user.role === "Quản lý") {
      elRoleDesc.textContent = "Quản lý bài viết, lịch đăng, duyệt nội dung và xem báo cáo. Không quản lý tài khoản.";
    } else {
      elRoleDesc.textContent = "Soạn thảo, quản lý bài viết cá nhân và gửi yêu cầu phê duyệt nội dung.";
    }
  }

  if (elToggle) {
    elToggle.classList.toggle("off", user.status === "Đã khóa");
  }
}

export function updateSelectedUserRole() {
  const elRole = document.getElementById("detailUserRoleSelect");
  const elRoleDesc = document.getElementById("detailUserRoleDesc");
  if (!elRole || !elRoleDesc) return;

  const role = elRole.value;
  if (role === "Quản trị viên") {
    elRoleDesc.textContent = "Toàn quyền quản trị hệ thống, quản lý tài khoản, phê duyệt và cài đặt hệ thống.";
  } else if (role === "Quản lý") {
    elRoleDesc.textContent = "Quản lý bài viết, lịch đăng, duyệt nội dung và xem báo cáo. Không quản lý tài khoản.";
  } else {
    elRoleDesc.textContent = "Soạn thảo, quản lý bài viết cá nhân và gửi yêu cầu phê duyệt nội dung.";
  }
}

export function toggleUserLoginStatus() {
  const user = state.users.find(u => u.id === selectedUserId);
  if (!user) return;

  user.status = user.status === "Đã khóa" ? "Hoạt động" : "Đã khóa";
  saveState();
  renderUsersTable();
  showToast(`Đã ${user.status === 'Đã khóa' ? 'khóa' : 'mở khóa'} quyền đăng nhập của ${user.name}!`, "info");
}

export function saveSelectedUserDetails() {
  const user = state.users.find(u => u.id === selectedUserId);
  if (!user) return;

  const newRole = document.getElementById("detailUserRoleSelect")?.value;
  if (newRole) user.role = newRole;

  saveState();
  renderUsersTable();
  showToast(`Đã lưu thay đổi cho tài khoản ${user.name}!`, "success");
}

export function toggleLockSelectedUser() {
  toggleUserLoginStatus();
}

export function deleteSelectedUser() {
  const user = state.users.find(u => u.id === selectedUserId);
  if (!user) return;

  if (confirm(`Bạn có chắc chắn muốn xóa tài khoản ${user.name} khỏi hệ thống?`)) {
    const idx = state.users.findIndex(u => u.id === selectedUserId);
    if (idx !== -1) {
      state.users.splice(idx, 1);
      selectedUserId = state.users[0]?.id || 1;
      saveState();
      renderUsersTable();
      showToast(`Đã xóa tài khoản ${user.name}!`, "info");
    }
  }
}
