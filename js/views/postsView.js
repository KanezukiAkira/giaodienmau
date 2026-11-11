/**
 * View: Post Management ()
 */
import { state, saveState } from '../core/state.js';
import { escapeHTML } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';
import { postsApi } from '../api/postsApi.js';

export function updateMetricsDisplay() {
  const total = state.posts.length;
  const draft = state.posts.filter(p => p.status === "draft" || p.status === "revising").length;
  const pending = state.posts.filter(p => p.status === "pending").length;
  const published = state.posts.filter(p => p.status === "published" || p.status === "scheduled").length;

  const elTotal = document.getElementById("metricTotal");
  const elDraft = document.getElementById("metricDraft");
  const elPending = document.getElementById("metricPending");
  const elPublished = document.getElementById("metricPublished");

  if (elTotal) elTotal.textContent = total;
  if (elDraft) elDraft.textContent = draft;
  if (elPending) elPending.textContent = pending;
  if (elPublished) elPublished.textContent = published;

  const approvalBadge = document.getElementById("pendingApprovalCount");
  if (approvalBadge) {
    approvalBadge.textContent = pending;
    approvalBadge.style.display = pending > 0 ? "inline-block" : "none";
  }
}

export function filterByTab(tab) {
  state.currentTab = tab;
  document.querySelectorAll(".list-tabs .tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tab);
  });
  filterPosts();
}

export function filterPosts() {
  const searchTerm = (document.getElementById("postFilterSearch")?.value || "").toLowerCase().trim();
  const statusFilter = document.getElementById("postFilterStatus")?.value || "";
  const authorFilter = document.getElementById("postFilterAuthor")?.value || "";
  const timeFilter = document.getElementById("postFilterTime")?.value || "all";

  let filtered = state.posts.filter(post => {
    // Tab filter
    if (state.currentTab === "mine" && !post.isMine) return false;
    if (state.currentTab === "archived" && !post.isArchived) return false;
    if (state.currentTab === "all" && post.isArchived) return false;

    // Search filter
    if (searchTerm) {
      const matchTitle = post.title.toLowerCase().includes(searchTerm);
      const matchId = post.id.toLowerCase().includes(searchTerm);
      const matchAuthor = post.author.toLowerCase().includes(searchTerm);
      if (!matchTitle && !matchId && !matchAuthor) return false;
    }

    // Status filter
    if (statusFilter && post.status !== statusFilter) return false;

    // Author filter
    if (authorFilter && post.author !== authorFilter) return false;

    // Time filter
    if (timeFilter && timeFilter !== "all") {
      const dateStr = post.scheduleDate || post.displayDate || "";
      if (timeFilter === "oct" && !dateStr.includes("-10") && !dateStr.includes("/10/")) return false;
      if (timeFilter === "sep" && !dateStr.includes("-09") && !dateStr.includes("/09/")) return false;
    }

    return true;
  });

  renderPostsRows(filtered);
}

export function resetFilters() {
  if (document.getElementById("postFilterSearch")) document.getElementById("postFilterSearch").value = "";
  if (document.getElementById("postFilterStatus")) document.getElementById("postFilterStatus").value = "";
  if (document.getElementById("postFilterAuthor")) document.getElementById("postFilterAuthor").value = "";
  if (document.getElementById("postFilterTime")) document.getElementById("postFilterTime").value = "all";
  state.currentTab = "all";
  document.querySelectorAll(".list-tabs .tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === "all");
  });
  renderPostsTable();
}

export function renderPostsTable() {
  filterPosts();
}

export function handlePostTitleClick(postId) {
  const post = state.posts.find(p => p.id === postId);
  if (!post) return;
  if (post.status === "pending") {
    state.activeApprovalPostId = postId;
    if (window.switchView) window.switchView("approvals");
  } else {
    if (window.openEditPost) window.openEditPost(postId);
  }
}

export async function handleAutoPublishNow(postId) {
  const post = state.posts.find(p => p.id === postId);
  if (!post) return;

  const confirmed = window.confirm(`Bạn có chắc muốn hệ thống TỰ ĐỘNG ĐĂNG NGAY 100% bài viết "${post.title}" lên mạng xã hội qua API?`);
  if (!confirmed) return;

  try {
    showToast(`Đang tự động xuất bản bài viết ${post.id} qua API...`, "info");
    const rawId = post.rawId || (post.id && !isNaN(post.id) ? parseInt(post.id, 10) : null);
    if (!rawId) {
      showToast("Không tìm thấy mã bài viết trên máy chủ!", "danger");
      return;
    }

    const res = await postsApi.autoPublishPost(rawId);
    post.status = "published";
    post.statusText = "Đã xuất bản";
    post.publishedUrl = res.published_url || post.publishedUrl;
    post.publishedAt = res.published_at || new Date().toISOString();

    saveState();
    if (window.renderPostsTable) window.renderPostsTable();
    if (window.renderKanbanBoard) window.renderKanbanBoard();
    if (window.updateMetricsDisplay) window.updateMetricsDisplay();
    showToast(`Đã tự động đăng bài viết thành công 100% qua API!`, "success");
  } catch (err) {
    console.error("Auto publish error:", err);
    showToast(`Lỗi tự động đăng bài: ${err.message}`, "danger");
  }
}

export function renderPostsRows(posts) {
  const tbody = document.getElementById("postsTableBody");
  const emptyState = document.getElementById("postsEmptyState");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (posts.length === 0) {
    if (emptyState) emptyState.style.display = "block";
    return;
  }
  if (emptyState) emptyState.style.display = "none";

  posts.forEach(post => {
    const tr = document.createElement("tr");

    let statusBadgeClass = "badge-draft";
    if (post.status === "published") statusBadgeClass = "badge-published";
    else if (post.status === "scheduled") statusBadgeClass = "badge-scheduled";
    else if (post.status === "pending") statusBadgeClass = "badge-pending";
    else if (post.status === "revising") statusBadgeClass = "badge-revising";

    const isPublishable = post.status === "approved" || post.status === "scheduled";
    const isPublished = post.status === "published";

    tr.innerHTML = `
      <td>
        <div class="table-post-identity">
          <div class="post-type-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="post-text-meta">
            <strong onclick="window.handlePostTitleClick('${post.id}')">${escapeHTML(post.title)}</strong>
            <span>${post.id} · ${escapeHTML(post.channels || "Facebook & Instagram")}</span>
          </div>
        </div>
      </td>
      <td>${escapeHTML(post.author)}</td>
      <td>
        <span class="badge ${statusBadgeClass}">${post.statusText}</span>
      </td>
      <td>${post.displayDate}</td>
      <td style="text-align: right;">
        <div class="row-actions">
          ${isPublishable ? `
            <button class="action-icon-btn" style="color: #0d47a1; background: #e3f2fd; border-color: #90caf9;" onclick="window.handleAutoPublishNow('${post.id}')" title="Tự động đăng ngay 100% qua API">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            </button>
            <button class="action-icon-btn" style="color: #2e7d32; border-color: #a5d6a7;" onclick="window.openConfirmPublishModal('${post.id}')" title="Xác nhận đã đăng bài thủ công (MOD-06)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          ` : ''}
          ${isPublished ? `
            ${post.publishedUrl ? `
              <a href="${escapeHTML(post.publishedUrl)}" target="_blank" rel="noopener noreferrer" class="action-icon-btn" style="color: #1976d2;" title="Mở liên kết bài đăng thực tế">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            ` : ''}
            <button class="action-icon-btn" style="color: #7b1fa2;" onclick="window.openMetricsModal('${post.id}')" title="Cập nhật hoặc đồng bộ chỉ số (MOD-07)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </button>
          ` : ''}
          <button class="action-icon-btn" onclick="window.openEditPost('${post.id}')" title="Chỉnh sửa">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
          </button>
          <button class="action-icon-btn danger" onclick="window.openDeleteModal('${post.id}')" title="Xóa bài viết">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
