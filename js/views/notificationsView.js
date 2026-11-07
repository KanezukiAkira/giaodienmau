/**
 * View: Notifications Management (Dropdown & Full Page Feed)
 */
import { state, saveState } from '../core/state.js';
import { escapeHTML } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';

let currentNotifTab = "all";

export function filterNotifsByTab(tab) {
  currentNotifTab = tab;
  document.getElementById("notifTabAll")?.classList.toggle("active", tab === "all");
  document.getElementById("notifTabUnread")?.classList.toggle("active", tab === "unread");
  renderNotificationsList();
}

export function renderNotificationsList() {
  const dropdownList = document.getElementById("notifDropdownList");
  const fullPageList = document.getElementById("notifFullPageList");

  if (dropdownList) dropdownList.innerHTML = "";
  if (fullPageList) fullPageList.innerHTML = "";

  const feedItems = state.notifications.filter(n => {
    if (currentNotifTab === "unread" && !n.unread) return false;
    return true;
  });

  state.notifications.forEach(notif => {
    // Dropdown item (shows recent 6)
    if (dropdownList) {
      const item = document.createElement("div");
      item.className = `notif-item ${notif.unread ? "unread" : ""}`;
      item.innerHTML = `
        <div class="notif-item-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </div>
        <div class="notif-item-text">
          <strong>${escapeHTML(notif.title)}</strong>
          <p>${escapeHTML(notif.desc)}</p>
          <span>${notif.time}</span>
        </div>
      `;
      item.onclick = () => handleNotifClick(notif);
      dropdownList.appendChild(item);
    }
  });

  if (fullPageList) {
    if (feedItems.length === 0) {
      fullPageList.innerHTML = `
        <div class="empty-state" style="padding: 40px 20px; text-align: center;">
          <p style="color: #a4989d; font-size: 13px;">Không có thông báo nào ${currentNotifTab === 'unread' ? 'chưa đọc' : ''}</p>
        </div>
      `;
    } else {
      feedItems.forEach(notif => {
        const feedItem = document.createElement("div");
        feedItem.className = `notif-feed-item ${notif.unread ? "unread" : ""}`;
        feedItem.style.cursor = "pointer";
        feedItem.innerHTML = `
          <div class="notif-feed-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </div>
          <div class="notif-feed-content">
            <h4>${escapeHTML(notif.title)}</h4>
            <p>${escapeHTML(notif.desc)}</p>
            <span class="notif-feed-time">${notif.time}</span>
          </div>
          ${notif.unread ? '<span class="badge badge-light" style="background: #fdedf2; color: #cc618a; font-weight: 600;">Mới</span>' : ''}
        `;
        feedItem.onclick = () => handleNotifClick(notif);
        fullPageList.appendChild(feedItem);
      });
    }
  }

  updateNotifCounters();
}

export function handleNotifClick(notif) {
  notif.unread = false;
  saveState();
  renderNotificationsList();
  if (notif.targetPostId) {
    state.activeApprovalPostId = notif.targetPostId;
  }
  if (notif.targetView) {
    if (window.switchView) {
      window.switchView(notif.targetView);
    }
  }
}

export function markAllNotifsRead() {
  state.notifications.forEach(n => n.unread = false);
  saveState();
  renderNotificationsList();
  showToast("Đã đánh dấu đã đọc tất cả thông báo!", "info");
}

export function updateNotifCounters() {
  const unreadCount = state.notifications.filter(n => n.unread).length;
  const navBadge = document.getElementById("unreadNotifCount");
  const dot = document.getElementById("notifDot");

  if (navBadge) {
    navBadge.textContent = unreadCount;
    navBadge.style.display = unreadCount > 0 ? "inline-block" : "none";
  }
  if (dot) {
    dot.style.display = unreadCount > 0 ? "block" : "none";
  }
}
