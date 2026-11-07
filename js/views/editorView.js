/**
 * View: Editorial & Create/Edit Post (& )
 */
import { state, saveState } from '../core/state.js';
import { showToast } from '../components/toast.js';
import { formatDateDisplay } from '../utils/formatters.js';

export function openCreatePost() {
  const elEditId = document.getElementById("editPostId");
  if (elEditId) elEditId.value = "";
  
  const elHeading = document.getElementById("editorTitleHeading");
  if (elHeading) elHeading.textContent = "Tạo bài viết mới";

  const elBreadcrumb = document.getElementById("editorBreadcrumbAction");
  if (elBreadcrumb) elBreadcrumb.textContent = "Tạo bài viết";

  const elTitle = document.getElementById("postTitleInput");
  if (elTitle) elTitle.value = "";

  const elCat = document.getElementById("postCategorySelect");
  if (elCat) elCat.value = "Chăm sóc da";

  const elCamp = document.getElementById("postCampaignSelect");
  if (elCamp) elCamp.value = "Nâng niu làn da · Tháng 11";

  const elChannels = document.getElementById("postChannelsSelect");
  if (elChannels) elChannels.value = "Facebook & Instagram";

  const elSchedule = document.getElementById("postScheduleTimeInput");
  if (elSchedule) elSchedule.value = "2026-11-09T08:00";

  const elBody = document.getElementById("articleBodyContent");
  if (elBody) {
    elBody.innerHTML = `
      <h2 style="font-family: 'Playfair Display', serif; font-size: 22px; color: #574b50; margin-bottom: 12px;">Tiêu đề đoạn mở đầu...</h2>
      <p style="margin-bottom: 12px;">Nhập nội dung chia sẻ cảm hứng và bí quyết làm đẹp tại đây...</p>
      <p style="color: #cc618a; font-weight: 500;">#BlossomBeauty</p>
    `;
  }

  const elImg = document.getElementById("mediaPreviewImg");
  if (elImg) elImg.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80";

  const elFileName = document.getElementById("attachmentFileName");
  if (elFileName) elFileName.textContent = "blossom-editorial.jpg";

  const elBadge = document.getElementById("editorCurrentStatusBadge");
  if (elBadge) {
    elBadge.textContent = "Bản nháp";
    elBadge.className = "badge badge-draft";
  }

  updateWordCount();
  updateChecklist();
  window.switchView("editor");
}

export function openEditPost(postId) {
  const post = state.posts.find(p => p.id === postId);
  if (!post) return;

  const elEditId = document.getElementById("editPostId");
  if (elEditId) elEditId.value = post.id;

  const elHeading = document.getElementById("editorTitleHeading");
  if (elHeading) elHeading.textContent = "Chỉnh sửa bài viết";

  const elBreadcrumb = document.getElementById("editorBreadcrumbAction");
  if (elBreadcrumb) elBreadcrumb.textContent = `Chỉnh sửa / ${post.id}`;

  const elTitle = document.getElementById("postTitleInput");
  if (elTitle) elTitle.value = post.title;

  const elCat = document.getElementById("postCategorySelect");
  if (elCat) elCat.value = post.category || "Chăm sóc da";

  const elCamp = document.getElementById("postCampaignSelect");
  if (elCamp) elCamp.value = post.campaign || "Nâng niu làn da · Tháng 11";

  const elChannels = document.getElementById("postChannelsSelect");
  if (elChannels) elChannels.value = post.channels || "Facebook & Instagram";

  const elAuthor = document.getElementById("postAuthorInput");
  if (elAuthor) elAuthor.value = post.author;
  
  const formattedSchedule = post.scheduleDate ? `${post.scheduleDate}T${post.scheduleTime || '08:00'}` : "2026-11-05T08:00";
  const elSchedule = document.getElementById("postScheduleTimeInput");
  if (elSchedule) elSchedule.value = formattedSchedule;

  const elBody = document.getElementById("articleBodyContent");
  if (elBody) elBody.innerHTML = post.content || "";

  if (post.heroImage) {
    const elImg = document.getElementById("mediaPreviewImg");
    if (elImg) elImg.src = post.heroImage;
  }

  const badge = document.getElementById("editorCurrentStatusBadge");
  if (badge) {
    badge.textContent = post.statusText;
    badge.className = `badge badge-${post.status}`;
  }

  updateWordCount();
  updateChecklist();
  window.switchView("editor");
}

export function savePostDraft() {
  const postId = document.getElementById("editPostId")?.value;
  const title = document.getElementById("postTitleInput")?.value.trim() || "Bản nháp chưa đặt tên";
  const category = document.getElementById("postCategorySelect")?.value || "Chăm sóc da";
  const campaign = document.getElementById("postCampaignSelect")?.value || "Nâng niu làn da · Tháng 11";
  const channels = document.getElementById("postChannelsSelect")?.value || "Facebook & Instagram";
  const scheduleTimeRaw = document.getElementById("postScheduleTimeInput")?.value || "";
  const content = document.getElementById("articleBodyContent")?.innerHTML || "";
  const heroImage = document.getElementById("mediaPreviewImg")?.src || "";

  const [sDate, sTime] = scheduleTimeRaw.split("T");

  if (postId) {
    const existing = state.posts.find(p => p.id === postId);
    if (existing) {
      existing.title = title;
      existing.category = category;
      existing.campaign = campaign;
      existing.channels = channels;
      existing.content = content;
      existing.heroImage = heroImage;
      if (sDate) {
        existing.scheduleDate = sDate;
        existing.scheduleTime = sTime || "08:00";
        existing.displayDate = formatDateDisplay(sDate);
      }
      showToast(`Đã lưu bản nháp "${title}" thành công!`, "success");
    }
  } else {
    const newId = `BL-${String(state.posts.length + 120).padStart(4, "0")}`;
    const newPost = {
      id: newId,
      title: title,
      author: "Minh Anh",
      category: category,
      campaign: campaign,
      status: "draft",
      statusText: "Bản nháp",
      scheduleDate: sDate || "2026-11-10",
      scheduleTime: sTime || "08:00",
      displayDate: formatDateDisplay(sDate || "2026-11-10"),
      channels: channels,
      heroImage: heroImage,
      content: content,
      isArchived: false,
      isMine: true
    };
    state.posts.unshift(newPost);
    const elEditId = document.getElementById("editPostId");
    if (elEditId) elEditId.value = newId;
    showToast(`Đã tạo bản nháp mới ${newId}!`, "success");
  }

  saveState();
  updateChecklist();
}

export function submitPostForApproval() {
  const title = document.getElementById("postTitleInput")?.value.trim();
  if (!title) {
    showToast("Vui lòng nhập tiêu đề bài viết trước khi gửi duyệt!", "error");
    document.getElementById("postTitleInput")?.focus();
    return;
  }

  savePostDraft();
  const postId = document.getElementById("editPostId")?.value;
  const post = state.posts.find(p => p.id === postId);
  if (!post) return;

  const subCode = document.getElementById("subModalCodeChannel");
  const subTitle = document.getElementById("subModalTitle");
  const subSched = document.getElementById("subModalSchedule");

  if (subCode) subCode.textContent = `${post.id} · ${(post.channels || "Facebook & Instagram").toUpperCase()}`;
  if (subTitle) subTitle.textContent = post.title;
  if (subSched) subSched.textContent = `Dự kiến đăng: ${post.displayDate} · ${post.scheduleTime || '08:00'}`;

  if (window.openSubmitApprovalModal) {
    window.openSubmitApprovalModal();
  }
}

export function commitPostSubmission() {
  const postId = document.getElementById("editPostId")?.value;
  const post = state.posts.find(p => p.id === postId);
  if (post) {
    post.status = "pending";
    post.statusText = "Chờ duyệt";
    post.submittedAt = "Vừa xong · " + new Date().toLocaleDateString("vi-VN");

    state.notifications.unshift({
      id: Date.now(),
      title: `Bài viết ${post.id} cần phê duyệt`,
      desc: `${post.author} vừa gửi bài viết "${post.title}" để phê duyệt.`,
      time: "Vừa xong",
      unread: true,
      targetView: "approvals",
      targetPostId: post.id
    });

    saveState();
    showToast(`Đã gửi bài viết ${post.id} để quản trị viên phê duyệt!`, "success");
    state.activeApprovalPostId = post.id;
    setTimeout(() => window.switchView("approvals"), 400);
  }
}

export function updateWordCount() {
  const content = document.getElementById("articleBodyContent")?.innerText || "";
  const charCount = content.length;
  const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
  const el = document.getElementById("charCountDisplay");
  if (el) {
    el.textContent = `${words} từ · ${charCount.toLocaleString("vi-VN")} ký tự`;
  }
}

export function updateChecklist() {
  const title = document.getElementById("postTitleInput")?.value.trim();
  const schedule = document.getElementById("postScheduleTimeInput")?.value;
  const image = document.getElementById("mediaPreviewImg")?.src;

  const chkTitle = document.getElementById("chkTitle");
  const chkImage = document.getElementById("chkImage");
  const chkSchedule = document.getElementById("chkSchedule");

  if (chkTitle) chkTitle.classList.toggle("passed", Boolean(title));
  if (chkImage) chkImage.classList.toggle("passed", Boolean(image && !image.includes("placeholder")));
  if (chkSchedule) chkSchedule.classList.toggle("passed", Boolean(schedule));
}

export function formatDoc(cmd, val = null) {
  document.execCommand(cmd, false, val);
  updateWordCount();
}

export function addLink() {
  const url = prompt("Nhập địa chỉ liên kết (URL):", "https://");
  if (url) formatDoc("createLink", url);
}

export function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const elImg = document.getElementById("mediaPreviewImg");
    if (elImg) elImg.src = event.target.result;
    
    const elName = document.getElementById("attachmentFileName");
    if (elName) elName.textContent = file.name;

    const elSpecs = document.getElementById("attachmentSpecs");
    if (elSpecs) elSpecs.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB · Ảnh đại diện mới`;

    updateChecklist();
    showToast("Đã tải ảnh lên thành công!", "success");
  };
  reader.readAsDataURL(file);
}

export function removeAttachedImage() {
  const elImg = document.getElementById("mediaPreviewImg");
  if (elImg) elImg.src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80";

  const elName = document.getElementById("attachmentFileName");
  if (elName) elName.textContent = "chưa_có_ảnh.jpg";

  const elSpecs = document.getElementById("attachmentSpecs");
  if (elSpecs) elSpecs.textContent = "Chưa chọn tệp ảnh";

  updateChecklist();
  showToast("Đã xóa ảnh đính kèm", "info");
}
