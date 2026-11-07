/**
 * View: Dashboard / Kanban Progress Board (Node 3:45735)
 */
import { state, saveState } from '../core/state.js';
import { escapeHTML } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';
import { renderPostsTable, handlePostTitleClick } from './postsView.js';

let draggedPostId = null;

function formatShortDate(dateStr) {
  if (!dateStr) return "07/11";
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
  }
  if (dateStr.includes("/")) {
    const parts = dateStr.split("/");
    if (parts.length >= 2) return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}`;
  }
  return dateStr;
}

export function setBoardTab(tab) {
  document.getElementById("btnKanbanBoardTab")?.classList.toggle("active", tab === "board");
  document.getElementById("btnKanbanMemberTab")?.classList.toggle("active", tab === "member");
  
  const boardEl = document.getElementById("kanbanBoardContainer");
  const memberEl = document.getElementById("memberProgressView");
  const insightEl = document.getElementById("priorityInsightCard");

  if (tab === "board") {
    if (boardEl) boardEl.style.display = "grid";
    if (memberEl) memberEl.style.display = "none";
    if (insightEl) insightEl.style.display = "flex";
    renderKanbanBoard();
  } else {
    if (boardEl) boardEl.style.display = "none";
    if (memberEl) memberEl.style.display = "block";
    if (insightEl) insightEl.style.display = "none";
    renderMemberProgressView();
  }
}

export function filterKanbanBoard() {
  renderKanbanBoard();
}

export function renderKanbanBoard() {
  const authorFilter = document.getElementById("kbAuthorFilter")?.value || "";
  const campaignFilter = document.getElementById("kbCampaignFilter")?.value || "";

  const cardsDraft = document.getElementById("kbCardsDraft");
  const cardsPending = document.getElementById("kbCardsPending");
  const cardsRevising = document.getElementById("kbCardsRevising");
  const cardsScheduled = document.getElementById("kbCardsScheduled");

  if (!cardsDraft || !cardsPending || !cardsRevising || !cardsScheduled) return;

  cardsDraft.innerHTML = "";
  cardsPending.innerHTML = "";
  cardsRevising.innerHTML = "";
  cardsScheduled.innerHTML = "";

  let countDraft = 0;
  let countPending = 0;
  let countRevising = 0;
  let countScheduled = 0;

  state.posts.forEach(post => {
    if (post.isArchived) return;
    if (authorFilter && post.author !== authorFilter) return;
    if (campaignFilter && post.campaign !== campaignFilter) return;

    let progressPct = 35;
    let progressClass = "fill-purple";
    let isDone = false;

    if (post.status === "draft") {
      progressPct = post.id === "BL-0125" ? 35 : (post.id === "BL-0122" ? 20 : 25);
      progressClass = "fill-purple";
    } else if (post.status === "revising") {
      progressPct = post.id === "BL-0126" ? 50 : (post.id === "BL-0120" ? 55 : 45);
      progressClass = "";
    } else if (post.status === "pending") {
      progressPct = 70;
      progressClass = "fill-orange";
    } else if (post.status === "scheduled" || post.status === "published") {
      progressPct = 100;
      progressClass = "fill-green";
      isDone = true;
    }

    const initials = post.author
      ? post.author.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()
      : "BL";

    const dueDateStr = formatShortDate(post.scheduledDate || post.displayDate);

    const card = document.createElement("div");
    card.className = "kanban-card";
    card.draggable = true;
    card.ondragstart = (e) => handleDragStart(e, post.id);

    card.innerHTML = `
      <div class="kanban-card-top">
        <span class="kanban-card-id">${escapeHTML(post.id)}</span>
        <button class="kanban-card-ellipsis" onclick="event.stopPropagation(); window.handlePostTitleClick('${post.id}')" title="Tùy chọn">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/>
          </svg>
        </button>
      </div>
      <h4 class="kanban-card-title" onclick="window.handlePostTitleClick('${post.id}')">${escapeHTML(post.title)}</h4>
      <span class="kanban-card-channel">${escapeHTML(post.channels || "Facebook & Instagram")}</span>
      <div class="kanban-completion">
        <div class="completion-label-row">
          <span>Tiến độ</span>
          <span class="completion-pct ${isDone ? 'pct-green' : ''}">${progressPct}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${progressClass}" style="width: ${progressPct}%;"></div>
        </div>
      </div>
      <div class="kanban-card-footer">
        <div class="kanban-author">
          <div class="kanban-avatar" title="${escapeHTML(post.author)}">${initials}</div>
        </div>
        <div class="kanban-due">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>${dueDateStr}</span>
        </div>
      </div>
    `;

    if (post.status === "draft") {
      cardsDraft.appendChild(card);
      countDraft++;
    } else if (post.status === "pending") {
      cardsPending.appendChild(card);
      countPending++;
    } else if (post.status === "revising") {
      cardsRevising.appendChild(card);
      countRevising++;
    } else if (post.status === "scheduled" || post.status === "published") {
      cardsScheduled.appendChild(card);
      countScheduled++;
    }
  });

  const elDraft = document.getElementById("kbCountDraft");
  const elPending = document.getElementById("kbCountPending");
  const elRevising = document.getElementById("kbCountRevising");
  const elScheduled = document.getElementById("kbCountScheduled");

  if (elDraft) elDraft.textContent = countDraft < 10 ? `0${countDraft}` : countDraft;
  if (elPending) elPending.textContent = countPending < 10 ? `0${countPending}` : countPending;
  if (elRevising) elRevising.textContent = countRevising < 10 ? `0${countRevising}` : countRevising;
  if (elScheduled) elScheduled.textContent = countScheduled < 10 ? `0${countScheduled}` : countScheduled;

  const footDraft = document.getElementById("kbFooterDraft");
  const footPending = document.getElementById("kbFooterPending");
  const footRevising = document.getElementById("kbFooterRevising");
  const footScheduled = document.getElementById("kbFooterScheduled");

  if (footDraft) footDraft.textContent = `Xem tất cả ${countDraft} bài viết →`;
  if (footPending) footPending.textContent = `Xem tất cả ${countPending} bài viết →`;
  if (footRevising) footRevising.textContent = `Xem tất cả ${countRevising} bài viết →`;
  if (footScheduled) footScheduled.textContent = `Xem tất cả ${countScheduled} bài viết →`;
}

export function handleDragStart(e, postId) {
  draggedPostId = postId;
  e.dataTransfer.setData("text/plain", postId);
}

export function handleDragOver(e) {
  e.preventDefault();
  const col = e.currentTarget;
  col.classList.add("drag-over");
}

export function setupKanbanDragDrop() {
  document.querySelectorAll(".kanban-column").forEach(col => {
    col.addEventListener("dragleave", () => col.classList.remove("drag-over"));
  });
}

export function handleDrop(e, targetStatus) {
  e.preventDefault();
  const col = e.currentTarget;
  col.classList.remove("drag-over");

  const postId = draggedPostId || e.dataTransfer.getData("text/plain");
  if (!postId) return;

  const post = state.posts.find(p => p.id === postId);
  if (!post) return;

  if (post.status !== targetStatus) {
    post.status = targetStatus;
    if (targetStatus === "draft") post.statusText = "Bản nháp";
    else if (targetStatus === "revising") post.statusText = "Đang chỉnh sửa";
    else if (targetStatus === "pending") post.statusText = "Chờ duyệt";
    else if (targetStatus === "scheduled") post.statusText = "Đã lên lịch";

    saveState();
    renderKanbanBoard();
    renderPostsTable();
    showToast(`Đã chuyển bài viết ${post.id} sang "${post.statusText}"!`, "success");
  }
}

export function renderMemberProgressView() {
  const tbody = document.getElementById("memberProgressTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  state.users.forEach(user => {
    const userPosts = state.posts.filter(p => p.author === user.name);
    const draftCount = userPosts.filter(p => p.status === "draft").length;
    const revisingCount = userPosts.filter(p => p.status === "revising").length;
    const pendingCount = userPosts.filter(p => p.status === "pending").length;
    const pubCount = userPosts.filter(p => p.status === "published" || p.status === "scheduled").length;
    const pct = userPosts.length > 0 ? Math.round((pubCount / userPosts.length) * 100) : 0;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="table-post-identity">
          <div class="avatar avatar-sm">${user.avatar}</div>
          <div class="post-text-meta">
            <strong>${escapeHTML(user.name)}</strong>
            <span>${user.role}</span>
          </div>
        </div>
      </td>
      <td>${draftCount} bài</td>
      <td>${pendingCount} bài</td>
      <td>${revisingCount} bài</td>
      <td><strong>${pubCount} bài</strong></td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="progress-track" style="width: 100px;">
            <div class="progress-fill fill-green" style="width: ${pct}%;"></div>
          </div>
          <span style="font-size: 11px; font-weight: 600; color: #574b50;">${pct}%</span>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
