/**
 * View: Post Approval Detail ()
 */
import { state, saveState } from '../core/state.js';
import { escapeHTML } from '../utils/formatters.js';
import { showToast } from '../components/toast.js';

export function renderApprovalView(postId) {
  let post = state.posts.find(p => p.id === postId);
  if (!post) {
    post = state.posts.find(p => p.status === "pending") || state.posts[0];
  }
  if (!post) return;

  state.activeApprovalPostId = post.id;

  const elCode = document.getElementById("approvalPostCode");
  const elTitle = document.getElementById("approvalTitle");
  const elCat = document.getElementById("approvalCategoryRef");
  const elAuthor = document.getElementById("approvalAuthor");
  const elSubTime = document.getElementById("approvalSubmittedTime");
  const elHeroImg = document.getElementById("approvalHeroImg");
  const statusBadge = document.getElementById("approvalStatusBadge");
  const elContent = document.getElementById("approvalContent");
  const elAttachment = document.getElementById("approvalAttachmentName");

  if (elCode) elCode.textContent = post.id;
  if (elTitle) elTitle.textContent = post.title;
  if (elCat) elCat.textContent = `${post.id} · ${post.category || "Chăm sóc da"}`;
  if (elAuthor) elAuthor.textContent = post.author;
  if (elSubTime) elSubTime.textContent = post.submittedAt || `Gửi duyệt lúc 09:45 · ${post.displayDate}`;
  
  if (post.heroImage && elHeroImg) {
    elHeroImg.src = post.heroImage;
  }
  
  if (statusBadge) {
    statusBadge.textContent = post.statusText;
    statusBadge.className = `badge badge-${post.status}`;
  }

  if (elContent && post.content) {
    elContent.innerHTML = post.content;
  }

  if (elAttachment) {
    elAttachment.textContent = `${post.id.toLowerCase()}-attachment.jpg · 1,8 MB`;
  }

  // Side meta
  const sAuthor = document.getElementById("apprSideAuthor");
  const sChannels = document.getElementById("apprSideChannels");
  const sCamp = document.getElementById("apprSideCampaign");
  const sSched = document.getElementById("apprSideSchedule");

  if (sAuthor) sAuthor.textContent = post.author;
  if (sChannels) sChannels.textContent = post.channels || "Facebook & Instagram";
  if (sCamp) sCamp.textContent = post.campaign || "Nâng niu làn da · Tháng 11";
  if (sSched) sSched.textContent = `${post.displayDate} · ${post.scheduleTime || '08:00'}`;

  // Quick switch list of other pending posts
  const quickList = document.getElementById("approvalQuickSwitchList");
  if (quickList) {
    quickList.innerHTML = "";
    const pendings = state.posts.filter(p => p.status === "pending");
    if (pendings.length === 0) {
      quickList.innerHTML = `<span style="font-size: 11px; color: #a4989d; padding: 8px 0; display: block;">Không còn bài viết nào chờ duyệt</span>`;
    } else {
      pendings.forEach(p => {
        const item = document.createElement("div");
        const isActive = p.id === post.id;
        item.className = `pending-list-item ${isActive ? "active" : ""}`;
        if (isActive) {
          item.style.backgroundColor = "#fff8fa";
          item.style.borderColor = "#cc618a";
        }
        item.innerHTML = `
          <strong style="${isActive ? 'color: #cc618a;' : ''}">${escapeHTML(p.title)}</strong>
          <span>${p.id} · ${escapeHTML(p.author)}</span>
        `;
        item.onclick = () => renderApprovalView(p.id);
        quickList.appendChild(item);
      });
    }
  }
}

export function approveCurrentPost() {
  const post = state.posts.find(p => p.id === state.activeApprovalPostId);
  if (!post) return;

  post.status = "scheduled";
  post.statusText = "Đã lên lịch";

  state.notifications.unshift({
    id: Date.now(),
    title: `Bài viết ${post.id} đã được phê duyệt`,
    desc: `Quản trị viên Minh Anh đã phê duyệt bài viết "${post.title}". Bài viết sẽ đăng vào ${post.displayDate}.`,
    time: "Vừa xong",
    unread: true,
    targetView: "calendar"
  });

  saveState();
  showToast(`Đã phê duyệt bài viết ${post.id}! Trạng thái chuyển thành "Đã lên lịch".`, "success");

  // Check if there are other pending posts
  const nextPending = state.posts.find(p => p.status === "pending");
  if (nextPending) {
    renderApprovalView(nextPending.id);
  } else {
    renderApprovalView(post.id);
  }
}

export function downloadAttachmentSim() {
  const post = state.posts.find(p => p.id === state.activeApprovalPostId);
  const fileName = post ? `${post.id.toLowerCase()}-attachment.jpg` : "blossom-skincare.jpg";
  showToast(`Đang tải xuống tệp ${fileName} (1,8 MB)...`, "info");
}
