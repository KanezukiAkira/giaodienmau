/**
 * View: Editorial & Create/Edit Post (& )
 */
import { state, saveState, syncDataFromBackend } from '../core/state.js';
import { showToast } from '../components/toast.js';
import { formatDateDisplay } from '../utils/formatters.js';
import { postsApi } from '../api/postsApi.js';
import { approvalsApi } from '../api/approvalsApi.js';
import { getCurrentUser, isManager, isStaff, canEditPost } from '../core/permissions.js';
import { APP_CONFIG } from '../config/appConfig.js';

export function openCreatePost() {
  const elEditId = document.getElementById("editPostId");
  if (elEditId) elEditId.value = "";
  
  const elHeading = document.getElementById("editorTitleHeading");
  if (elHeading) elHeading.textContent = "Tạo bài viết mới";

  const elBreadcrumb = document.getElementById("editorBreadcrumbAction");
  if (elBreadcrumb) elBreadcrumb.textContent = "Tạo bài viết";

  const elTitle = document.getElementById("postTitleInput");
  if (elTitle) {
    elTitle.value = "";
    elTitle.readOnly = false;
  }

  const user = getCurrentUser();
  const elAuthor = document.getElementById("postAuthorInput");
  if (elAuthor) elAuthor.value = user.full_name || user.username || "Nhân viên biên tập";

  const elCat = document.getElementById("postCategorySelect");
  if (elCat) {
    elCat.value = "Chăm sóc da";
    elCat.disabled = false;
  }

  const elCamp = document.getElementById("postCampaignSelect");
  if (elCamp) {
    elCamp.value = "Nâng niu làn da · Tháng 11";
    elCamp.disabled = false;
  }

  const elChannels = document.getElementById("postChannelsSelect");
  if (elChannels) {
    elChannels.value = "Facebook & Instagram";
    elChannels.disabled = false;
  }

  const elSchedule = document.getElementById("postScheduleTimeInput");
  if (elSchedule) {
    elSchedule.value = "2026-11-09T08:00";
    elSchedule.disabled = false;
  }

  const elBody = document.getElementById("articleBodyContent");
  if (elBody) {
    elBody.contentEditable = "true";
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

  const alertEl = document.getElementById("editorRevisionAlert");
  if (alertEl) alertEl.style.display = "none";

  const btnDraft = document.getElementById("btnEditorSaveDraft");
  if (btnDraft) btnDraft.style.display = "";
  const btnSubmit = document.getElementById("btnEditorSubmitApproval");
  if (btnSubmit) btnSubmit.style.display = "";
  const notice = document.getElementById("editorReadOnlyNotice");
  if (notice) notice.style.display = "none";

  updateWordCount();
  updateChecklist();
  window.switchView("editor");
}

export function openEditPost(postId) {
  const post = state.posts.find(p => p.id === postId);
  if (!post) return;

  const user = getCurrentUser();
  const editable = canEditPost(post, user);

  const elEditId = document.getElementById("editPostId");
  if (elEditId) elEditId.value = post.id;

  const elHeading = document.getElementById("editorTitleHeading");
  const elBreadcrumb = document.getElementById("editorBreadcrumbAction");
  const elTitle = document.getElementById("postTitleInput");
  const elCat = document.getElementById("postCategorySelect");
  const elCamp = document.getElementById("postCampaignSelect");
  const elChannels = document.getElementById("postChannelsSelect");
  const elAuthor = document.getElementById("postAuthorInput");
  const elSchedule = document.getElementById("postScheduleTimeInput");
  const elBody = document.getElementById("articleBodyContent");
  const btnDraft = document.getElementById("btnEditorSaveDraft");
  const btnSubmit = document.getElementById("btnEditorSubmitApproval");
  const notice = document.getElementById("editorReadOnlyNotice");

  if (!editable) {
    if (notice) notice.style.display = "block";
    if (btnDraft) btnDraft.style.display = "none";
    if (btnSubmit) btnSubmit.style.display = "none";
    if (elHeading) elHeading.textContent = `Chi tiết bài viết (${post.statusText})`;
    if (elBreadcrumb) elBreadcrumb.textContent = `Chế độ chỉ xem / ${post.id}`;
    if (elTitle) elTitle.readOnly = true;
    if (elBody) elBody.contentEditable = "false";
    if (elCat) elCat.disabled = true;
    if (elCamp) elCamp.disabled = true;
    if (elChannels) elChannels.disabled = true;
    if (elSchedule) elSchedule.disabled = true;
  } else {
    if (notice) notice.style.display = "none";
    if (btnDraft) btnDraft.style.display = "";
    if (btnSubmit) btnSubmit.style.display = "";
    if (elHeading) elHeading.textContent = "Chỉnh sửa bài viết";
    if (elBreadcrumb) elBreadcrumb.textContent = `Chỉnh sửa / ${post.id}`;
    if (elTitle) elTitle.readOnly = false;
    if (elBody) elBody.contentEditable = "true";
    if (elCat) elCat.disabled = false;
    if (elCamp) elCamp.disabled = false;
    if (elChannels) elChannels.disabled = false;
    if (elSchedule) elSchedule.disabled = false;
  }

  if (elTitle) elTitle.value = post.title;
  if (elCat) elCat.value = post.category || "Chăm sóc da";
  if (elCamp) elCamp.value = post.campaign || "Nâng niu làn da · Tháng 11";
  if (elChannels) {
    const rawCh = (post.channels || "").toLowerCase();
    if (rawCh.includes("tiktok")) {
      elChannels.value = "Tiktok / Reels";
    } else if (rawCh.includes("instagram") && !rawCh.includes("facebook")) {
      elChannels.value = "Instagram Feed";
    } else if (rawCh === "facebook" || rawCh === "facebook page") {
      elChannels.value = "Facebook Page";
    } else {
      elChannels.value = post.channels || "Facebook & Instagram";
    }
  }
  if (elAuthor) elAuthor.value = post.author;
  
  const formattedSchedule = post.scheduleDate ? `${post.scheduleDate}T${post.scheduleTime || '08:00'}` : "2026-11-05T08:00";
  if (elSchedule) elSchedule.value = formattedSchedule;

  if (elBody) elBody.innerHTML = post.content || "";

  if (post.heroImage) {
    const elImg = document.getElementById("mediaPreviewImg");
    if (elImg) {
      elImg.src = post.heroImage.startsWith("/")
        ? `${APP_CONFIG.API_BASE_URL.replace(/\/api\/?$/, "")}${post.heroImage}`
        : post.heroImage;
    }
  }

  const badge = document.getElementById("editorCurrentStatusBadge");
  if (badge) {
    badge.textContent = post.statusText;
    badge.className = `badge badge-${post.status}`;
  }

  const alertEl = document.getElementById("editorRevisionAlert");
  const commentEl = document.getElementById("editorRevisionCommentText");
  if (alertEl) {
    if (post.status === "revising" || post.status === "rejected") {
      alertEl.style.display = "block";
      if (commentEl) commentEl.textContent = post.revisionFeedback || "Quản trị viên đã yêu cầu chỉnh sửa bài viết. Vui lòng hoàn thiện nội dung và gửi duyệt lại.";
      if (post.rawId) {
        approvalsApi.getApprovalHistory(post.rawId).then(history => {
          if (Array.isArray(history) && history.length > 0) {
            const lastAction = history[history.length - 1];
            if (lastAction && lastAction.comment && commentEl) {
              commentEl.textContent = lastAction.comment;
            }
          }
        }).catch(() => {});
      }
    } else {
      alertEl.style.display = "none";
    }
  }

  updateWordCount();
  updateChecklist();
  window.switchView("editor");
}

export async function savePostDraft() {
  const postId = document.getElementById("editPostId")?.value;
  const title = document.getElementById("postTitleInput")?.value.trim() || "Bản nháp chưa đặt tên";
  const category = document.getElementById("postCategorySelect")?.value || "Chăm sóc da";
  const campaign = document.getElementById("postCampaignSelect")?.value || "Nâng niu làn da · Tháng 11";
  const channels = document.getElementById("postChannelsSelect")?.value || "Facebook & Instagram";
  const scheduleTimeRaw = document.getElementById("postScheduleTimeInput")?.value || "";
  const content = document.getElementById("articleBodyContent")?.innerHTML || "";
  const heroImage = document.getElementById("mediaPreviewImg")?.src || "";

  const [sDate, sTime] = scheduleTimeRaw.split("T");

  let platformId = 1;
  const chLower = channels.toLowerCase();
  if (chLower.includes("tiktok")) {
    platformId = 3;
  } else if (chLower.includes("instagram") && !chLower.includes("facebook")) {
    platformId = 2;
  } else {
    platformId = 1; // Facebook Page or Facebook & Instagram
  }

  const plannedTime = sDate ? `${sDate}T${sTime || '08:00'}:00` : null;

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

      // Live Backend update
      if (existing.rawId) {
        try {
          await postsApi.updatePost(existing.rawId, {
            title,
            caption: content,
            platform_id: platformId,
            planned_publish_time: plannedTime
          });
        } catch (e) {
          console.warn("Backend updatePost warning:", e.message);
        }
      }
      showToast(`Đã lưu bản nháp "${title}" thành công!`, "success");
    }
  } else {
    let rawId = null;
    let newId = `BL-${String(Date.now()).slice(-4)}`;

    // Live Backend create
    try {
      const created = await postsApi.createPost({
        title,
        caption: content,
        hashtags: "#blossom",
        platform_id: platformId,
        media_type: "IMAGE",
        planned_publish_time: plannedTime
      });
      if (created && created.post_id) {
        rawId = created.post_id;
        newId = `BL-${String(rawId).padStart(4, "0")}`;
      }
    } catch (e) {
      console.warn("Backend createPost warning:", e.message);
    }

    const newPost = {
      id: newId,
      rawId: rawId,
      title: title,
      author: (JSON.parse(localStorage.getItem("blossom_current_user") || "{}")).full_name || "Nhân viên",
      category: category,
      campaign: campaign,
      status: "draft",
      statusText: "Bản nháp",
      scheduleDate: sDate || new Date().toISOString().split('T')[0],
      scheduleTime: sTime || "08:00",
      displayDate: formatDateDisplay(sDate || new Date().toISOString().split('T')[0]),
      channels: channels,
      heroImage: heroImage,
      content: content,
      isArchived: false,
      isMine: true
    };
    state.posts.unshift(newPost);
    const elEditId = document.getElementById("editPostId");
    if (elEditId) elEditId.value = newId;
    showToast(`Đã tạo bản nháp mới ${newId} lưu lên máy chủ!`, "success");
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

export async function commitPostSubmission() {
  const postId = document.getElementById("editPostId")?.value;
  const post = state.posts.find(p => p.id === postId);
  if (post) {
    post.status = "pending";
    post.statusText = "Chờ duyệt";
    post.submittedAt = "Vừa xong · " + new Date().toLocaleDateString("vi-VN");

    if (post.rawId) {
      try {
        await approvalsApi.submitForApproval(post.rawId, {
          comment: "Gửi phê duyệt bài viết"
        });
      } catch (e) {
        console.warn("Backend submitForApproval notice:", e.message);
      }
    }

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
    const user = getCurrentUser();
    const staff = isStaff(user);

    if (staff) {
      showToast(`Đã gửi bài viết ${post.id} lên máy chủ để Quản lý phê duyệt!`, "success");
      setTimeout(() => window.switchView("posts"), 400);
    } else {
      showToast(`Đã gửi bài viết ${post.id} lên máy chủ để phê duyệt!`, "success");
      state.activeApprovalPostId = post.id;
      setTimeout(() => window.switchView("approvals"), 400);
    }
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
  const title = (document.getElementById("postTitleInput")?.value || "").trim();
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

export async function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const elName = document.getElementById("attachmentFileName");
  if (elName) elName.textContent = file.name;

  const elSpecs = document.getElementById("attachmentSpecs");
  if (elSpecs) elSpecs.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB · Đang tải lên máy chủ...`;

  // Local instant preview
  const reader = new FileReader();
  reader.onload = (event) => {
    const elImg = document.getElementById("mediaPreviewImg");
    if (elImg) elImg.src = event.target.result;
  };
  reader.readAsDataURL(file);

  // Upload to Backend FastAPI
  try {
    const uploadRes = await postsApi.uploadMedia(file);
    if (uploadRes && uploadRes.file_url) {
      const elImg = document.getElementById("mediaPreviewImg");
      const displayUrl = uploadRes.file_url.startsWith("/")
        ? `${APP_CONFIG.API_BASE_URL.replace(/\/api\/?$/, "")}${uploadRes.file_url}`
        : uploadRes.file_url;
      if (elImg) elImg.src = displayUrl;
      if (elSpecs) elSpecs.textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB · Đã tải lên máy chủ`;
    }
  } catch (err) {
    console.warn("Media upload error:", err.message);
  }

  updateChecklist();
  showToast("Đã tải tệp hình ảnh lên thành công!", "success");
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
