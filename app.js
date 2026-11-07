/* ==========================================================================
   BLOSSOM BEAUTY STORE — JAVASCRIPT APPLICATION CORE
   Mock data, View Routing, State Management & Interactivity
   ========================================================================== */

// --- Initial Figma-matched Mock Data ---
const DEFAULT_POSTS = [
  {
    id: "BL-0128",
    title: "5 bước dưỡng da cho buổi sáng rạng rỡ",
    author: "Nguyễn Hà Linh",
    category: "Chăm sóc da",
    campaign: "Nâng niu làn da · Tháng 11",
    status: "published",
    statusText: "Đã xuất bản",
    scheduleDate: "2026-11-04",
    scheduleTime: "08:00",
    displayDate: "04/11/2026",
    channels: "Facebook & Instagram",
    heroImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    content: "Bắt đầu ngày mới bằng một chút yêu thương. Làn da cũng cần được nâng niu mỗi ngày. Cùng Blossom xây dựng chu trình chăm sóc da đơn giản, dịu nhẹ để luôn tự tin với vẻ đẹp tự nhiên của bạn.<br><br>1. Làm sạch da với sữa rửa mặt dịu nhẹ.<br>2. Cân bằng làn da và bổ sung serum cấp ẩm.<br>3. Dưỡng ẩm và bảo vệ da với kem chống nắng.<br><br>#BlossomBeauty #ChamSocDa #NangNiuLanDa",
    reach: "12.840",
    engagement: "1.148",
    engagementRate: "8,94%",
    isArchived: false,
    isMine: false
  },
  {
    id: "BL-0127",
    title: "Bí quyết chăm da mùa hanh khô",
    author: "Trần Ngọc Mai",
    category: "Chăm sóc da",
    campaign: "Nâng niu làn da · Tháng 11",
    status: "pending",
    statusText: "Chờ duyệt",
    scheduleDate: "2026-11-05",
    scheduleTime: "08:00",
    displayDate: "05/11/2026",
    channels: "Facebook & Instagram",
    heroImage: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop&q=80",
    content: "Làn da mềm mại, bất chấp tiết trời.<br>Khi tiết trời chuyển mùa, làn da dễ mất đi độ ẩm tự nhiên. Một chu trình chăm sóc dịu nhẹ sẽ giúp da luôn mềm mại, căng khỏe và rạng rỡ.<br><br>1. Làm sạch dịu nhẹ, giữ lại độ ẩm tự nhiên.<br>2. Bổ sung serum cấp ẩm chuyên sâu.<br>3. Khóa ẩm với kem dưỡng phù hợp.<br><br>#BlossomBeauty #ChamSocDa #NangNiuLanDa",
    submittedAt: "09:45 · 04/11/2026",
    isArchived: false,
    isMine: true
  },
  {
    id: "BL-0126",
    title: "Một chút yêu thương cho làn da",
    author: "Lê Thu Hương",
    category: "Trang điểm dịu nhẹ",
    campaign: "Nâng niu làn da · Tháng 11",
    status: "revising",
    statusText: "Đang chỉnh sửa",
    scheduleDate: "2026-11-06",
    scheduleTime: "10:30",
    displayDate: "06/11/2026",
    channels: "Facebook & Instagram",
    heroImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    content: "Yêu thương bản thân bắt đầu từ việc lắng nghe những nhu cầu mộc mạc nhất của làn da bạn.",
    isArchived: false,
    isMine: false
  },
  {
    id: "BL-0125",
    title: "Chọn serum phù hợp với làn da của bạn",
    author: "Nguyễn Hà Linh",
    category: "Chăm sóc da",
    campaign: "Rạng ngời đón nắng sớm",
    status: "draft",
    statusText: "Bản nháp",
    scheduleDate: "2026-11-07",
    scheduleTime: "14:00",
    displayDate: "07/11/2026",
    channels: "Facebook & Instagram",
    heroImage: "https://images.unsplash.com/photo-1608248597359-58801d00c32b?w=800&auto=format&fit=crop&q=80",
    content: "Mỗi loại da là một câu chuyện riêng biệt, hãy cùng tìm kiếm tinh chất serum phù hợp nhất.",
    isArchived: false,
    isMine: false
  },
  {
    id: "BL-0124",
    title: "Chống nắng mỗi ngày, nâng niu làn da",
    author: "Phạm Khánh Linh",
    category: "Bảo vệ làn da",
    campaign: "Nâng niu làn da · Tháng 11",
    status: "scheduled",
    statusText: "Đã lên lịch",
    scheduleDate: "2026-11-08",
    scheduleTime: "08:00",
    displayDate: "08/11/2026",
    channels: "Facebook & Instagram",
    heroImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&auto=format&fit=crop&q=80",
    content: "Kem chống nắng là bước bảo vệ tối quan trọng giúp làn da luôn giữ được vẻ đẹp thanh xuân.",
    isArchived: false,
    isMine: false
  },
  {
    id: "BL-0123",
    title: "Routine tối giản cho ngày bận rộn",
    author: "Trần Ngọc Mai",
    category: "Routine tối giản",
    campaign: "Nâng niu làn da · Tháng 11",
    status: "published",
    statusText: "Đã xuất bản",
    scheduleDate: "2026-11-02",
    scheduleTime: "09:00",
    displayDate: "02/11/2026",
    channels: "Facebook",
    heroImage: "https://images.unsplash.com/photo-1512290900672-1f4175394cb5?w=800&auto=format&fit=crop&q=80",
    content: "Chỉ với 3 bước cơ bản, bạn hoàn toàn có thể duy trì làn da ẩm mượt dù lịch trình dày đặc.",
    reach: "10.260",
    engagement: "986",
    engagementRate: "9,61%",
    isArchived: false,
    isMine: true
  },
  {
    id: "BL-0118",
    title: "Dịu dàng với làn da, dịu dàng với chính mình",
    author: "Lê Thu Hương",
    category: "Chăm sóc da",
    campaign: "Tái sinh tế bào da",
    status: "published",
    statusText: "Đã xuất bản",
    scheduleDate: "2026-10-28",
    scheduleTime: "11:00",
    displayDate: "28/10/2026",
    channels: "Instagram",
    heroImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
    content: "Một chút dịu dàng mỗi ngày sẽ làm nên sự thay đổi kỳ diệu cho sắc diện của bạn.",
    reach: "9.480",
    engagement: "824",
    engagementRate: "8,69%",
    isArchived: false,
    isMine: false
  },
  {
    id: "BL-0122",
    title: "Cấp ẩm chuyên sâu cùng Hyaluronic Acid",
    author: "Nguyễn Hà Linh",
    category: "Chăm sóc da",
    campaign: "Nâng niu làn da · Tháng 11",
    status: "pending",
    statusText: "Chờ duyệt",
    scheduleDate: "2026-11-09",
    scheduleTime: "15:00",
    displayDate: "09/11/2026",
    channels: "Facebook & Instagram",
    heroImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
    content: "Hyaluronic Acid - thành phần vàng giúp làn da ngậm nước căng mọng suốt 24 giờ.",
    submittedAt: "14:20 · 04/11/2026",
    isArchived: false,
    isMine: false
  },
  {
    id: "BL-0121",
    title: "Top 3 loại mặt nạ phục hồi làn da nhạy cảm",
    author: "Trần Ngọc Mai",
    category: "Chăm sóc da",
    campaign: "Rạng ngời đón nắng sớm",
    status: "draft",
    statusText: "Bản nháp",
    scheduleDate: "2026-11-11",
    scheduleTime: "09:30",
    displayDate: "11/11/2026",
    channels: "Facebook & Instagram",
    heroImage: "https://images.unsplash.com/photo-1567928805162-f6735e2634d0?w=800&auto=format&fit=crop&q=80",
    content: "Làn da mỏng manh rất cần những giải pháp làm dịu tức thì từ thiên nhiên lành tính.",
    isArchived: false,
    isMine: true
  },
  {
    id: "BL-0120",
    title: "Bí quyết dưỡng môi căng mọng mùa lạnh",
    author: "Lê Thu Hương",
    category: "Bảo vệ làn da",
    campaign: "Nâng niu làn da · Tháng 11",
    status: "scheduled",
    statusText: "Đã lên lịch",
    scheduleDate: "2026-11-12",
    scheduleTime: "08:00",
    displayDate: "12/11/2026",
    channels: "Instagram",
    heroImage: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
    content: "Đôi môi mềm mại giúp bạn luôn tỏa sáng nụ cười tự tin trong những ngày se lạnh.",
    isArchived: false,
    isMine: false
  },
  {
    id: "BL-0119",
    title: "Cách làm sạch cọ trang điểm chuẩn y khoa",
    author: "Phạm Khánh Linh",
    category: "Trang điểm dịu nhẹ",
    campaign: "Rạng ngời đón nắng sớm",
    status: "revising",
    statusText: "Đang chỉnh sửa",
    scheduleDate: "2026-11-13",
    scheduleTime: "16:00",
    displayDate: "13/11/2026",
    channels: "Facebook",
    heroImage: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80",
    content: "Vệ sinh cọ trang điểm định kỳ là bước ngăn ngừa mụn và bảo vệ làn da hiệu quả nhất.",
    isArchived: false,
    isMine: false
  },
  {
    id: "BL-0115",
    title: "Chăm sóc da sau khi điều trị laser",
    author: "Minh Anh",
    category: "Chăm sóc da",
    campaign: "Tái sinh tế bào da",
    status: "published",
    statusText: "Đã xuất bản",
    scheduleDate: "2026-10-15",
    scheduleTime: "10:00",
    displayDate: "15/10/2026",
    channels: "Facebook & Instagram",
    heroImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80",
    content: "Hướng dẫn chi tiết cách bảo vệ da non sau liệu trình laser giúp phục hồi nhanh chóng.",
    isArchived: true,
    isMine: true
  }
];

const DEFAULT_USERS = [
  { id: 1, name: "Minh Anh", email: "minhanh@blossom.vn", role: "Quản trị viên", postCount: 36, status: "Hoạt động", avatar: "MA" },
  { id: 2, name: "Trần Ngọc Mai", email: "ngocmai@blossom.vn", role: "Biên tập viên", postCount: 42, status: "Hoạt động", avatar: "NM" },
  { id: 3, name: "Nguyễn Hà Linh", email: "halinh@blossom.vn", role: "Biên tập viên", postCount: 38, status: "Hoạt động", avatar: "HL" },
  { id: 4, name: "Lê Thu Hương", email: "thuhuong@blossom.vn", role: "Biên tập viên", postCount: 12, status: "Hoạt động", avatar: "TH" },
  { id: 5, name: "Phạm Khánh Linh", email: "khanhlinh@blossom.vn", role: "Cộng tác viên", postCount: 8, status: "Hoạt động", avatar: "KL" }
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    title: "Bài viết BL-0127 cần phê duyệt",
    desc: "Trần Ngọc Mai vừa gửi bài viết \"Bí quyết chăm da mùa hanh khô\" để quản trị viên phê duyệt.",
    time: "5 phút trước",
    unread: true,
    targetView: "approvals",
    targetPostId: "BL-0127"
  },
  {
    id: 2,
    title: "Nhắc lịch đăng bài",
    desc: "Bài viết BL-0124 sẽ được tự động đăng lên Facebook & Instagram vào lúc 08:00 sáng mai.",
    time: "1 giờ trước",
    unread: true,
    targetView: "calendar"
  },
  {
    id: 3,
    title: "Báo cáo tuần đã sẵn sàng",
    desc: "Hiệu quả nội dung tuần đầu tháng 11 tăng trưởng 15,2% lượt tương tác.",
    time: "Hôm qua",
    unread: true,
    targetView: "statistics"
  },
  {
    id: 4,
    title: "Yêu cầu chỉnh sửa bài viết BL-0126",
    desc: "Quản trị viên đã gửi phản hồi: Cần bổ sung các bước chống nắng và hình ảnh chi tiết.",
    time: "2 ngày trước",
    unread: false,
    targetView: "posts"
  }
];

// --- Application State ---
let state = {
  posts: JSON.parse(localStorage.getItem("blossom_posts")) || DEFAULT_POSTS,
  users: JSON.parse(localStorage.getItem("blossom_users")) || DEFAULT_USERS,
  notifications: JSON.parse(localStorage.getItem("blossom_notifs")) || DEFAULT_NOTIFICATIONS,
  currentView: "posts",
  currentTab: "all",
  activeApprovalPostId: "BL-0127",
  deleteTargetPostId: null,
  calendarCurrentDate: new Date(2026, 10, 1) // November 2026
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  renderKanbanBoard();
  renderPostsTable();
  updateMetricsDisplay();
  renderCalendar();
  renderApprovalView(state.activeApprovalPostId);
  renderNotificationsList();
  renderUsersTable();
  updateNotifCounters();
  setupKeyboardShortcuts();
});

// --- State Persistence ---
function saveState() {
  localStorage.setItem("blossom_posts", JSON.stringify(state.posts));
  localStorage.setItem("blossom_users", JSON.stringify(state.users));
  localStorage.setItem("blossom_notifs", JSON.stringify(state.notifications));
  updateMetricsDisplay();
  updateNotifCounters();
  renderKanbanBoard();
}

// --- View Router ---
function switchView(viewName) {
  state.currentView = viewName;

  // Update panels
  document.querySelectorAll(".view-panel").forEach(panel => {
    panel.classList.remove("active");
  });
  const targetPanel = document.getElementById(`view-${viewName}`);
  if (targetPanel) {
    targetPanel.classList.add("active");
  }

  // Update Sidebar active state
  document.querySelectorAll(".nav-item").forEach(item => {
    if (item.getAttribute("data-view") === viewName) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Close any popovers
  closeAllDropdowns();

  // View specific refreshes
  if (viewName === "dashboard") {
    renderKanbanBoard();
  } else if (viewName === "posts") {
    renderPostsTable();
  } else if (viewName === "calendar") {
    renderCalendar();
  } else if (viewName === "approvals") {
    renderApprovalView(state.activeApprovalPostId);
  } else if (viewName === "notifications") {
    renderNotificationsList();
  } else if (viewName === "users") {
    renderUsersTable();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- VIEW 0: Kanban Progress Dashboard () Logic ---
let draggedPostId = null;

function setBoardTab(tab) {
  document.getElementById("btnKanbanBoardTab")?.classList.toggle("active", tab === "board");
  document.getElementById("btnKanbanMemberTab")?.classList.toggle("active", tab === "member");
  
  const boardEl = document.getElementById("kanbanBoardContainer");
  const memberEl = document.getElementById("memberProgressView");

  if (tab === "board") {
    if (boardEl) boardEl.style.display = "grid";
    if (memberEl) memberEl.style.display = "none";
    renderKanbanBoard();
  } else {
    if (boardEl) boardEl.style.display = "none";
    if (memberEl) memberEl.style.display = "block";
    renderMemberProgressView();
  }
}

function filterKanbanBoard() {
  renderKanbanBoard();
}

function renderKanbanBoard() {
  const authorFilter = document.getElementById("kbAuthorFilter")?.value || "";
  const campaignFilter = document.getElementById("kbCampaignFilter")?.value || "";

  const cardsDraft = document.getElementById("kbCardsDraft");
  const cardsRevising = document.getElementById("kbCardsRevising");
  const cardsPending = document.getElementById("kbCardsPending");
  const cardsScheduled = document.getElementById("kbCardsScheduled");

  if (!cardsDraft || !cardsRevising || !cardsPending || !cardsScheduled) return;

  cardsDraft.innerHTML = "";
  cardsRevising.innerHTML = "";
  cardsPending.innerHTML = "";
  cardsScheduled.innerHTML = "";

  let countDraft = 0;
  let countRevising = 0;
  let countPending = 0;
  let countScheduled = 0;

  state.posts.forEach(post => {
    if (post.isArchived) return;
    if (authorFilter && post.author !== authorFilter) return;
    if (campaignFilter && post.campaign !== campaignFilter) return;

    let progressPct = 25;
    let progressClass = "fill-purple";
    if (post.status === "revising") {
      progressPct = 40;
      progressClass = "fill-purple";
    } else if (post.status === "pending") {
      progressPct = 70;
      progressClass = "fill-orange";
    } else if (post.status === "scheduled" || post.status === "published") {
      progressPct = 100;
      progressClass = "fill-green";
    }

    const card = document.createElement("div");
    card.className = "kanban-card";
    card.draggable = true;
    card.ondragstart = (e) => handleDragStart(e, post.id);

    card.innerHTML = `
      <div class="kanban-card-meta">
        <strong>${post.id}</strong>
        <span class="badge ${post.status === 'published' ? 'badge-published' : post.status === 'pending' ? 'badge-pending' : 'badge-draft'}">${post.statusText}</span>
      </div>
      <h4 class="kanban-card-title" onclick="handlePostTitleClick('${post.id}')">${escapeHTML(post.title)}</h4>
      <span class="kanban-card-channel">${escapeHTML(post.channels)}</span>
      <div class="progress-bar-wrapper">
        <div class="progress-label-row">
          <span>Tiến độ</span>
          <span>${progressPct}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${progressClass}" style="width: ${progressPct}%;"></div>
        </div>
      </div>
      <div class="kanban-card-footer">
        <div class="kanban-author">
          <div class="avatar avatar-sm" style="width: 22px; height: 22px; font-size: 9px;">${post.author.split(' ').map(w=>w[0]).slice(-2).join('')}</div>
          <span>${escapeHTML(post.author)}</span>
        </div>
        <span class="kanban-due">${post.displayDate}</span>
      </div>
    `;

    if (post.status === "draft") {
      cardsDraft.appendChild(card);
      countDraft++;
    } else if (post.status === "revising") {
      cardsRevising.appendChild(card);
      countRevising++;
    } else if (post.status === "pending") {
      cardsPending.appendChild(card);
      countPending++;
    } else if (post.status === "scheduled" || post.status === "published") {
      cardsScheduled.appendChild(card);
      countScheduled++;
    }
  });

  const elDraft = document.getElementById("kbCountDraft");
  const elRevising = document.getElementById("kbCountRevising");
  const elPending = document.getElementById("kbCountPending");
  const elScheduled = document.getElementById("kbCountScheduled");

  if (elDraft) elDraft.textContent = countDraft;
  if (elRevising) elRevising.textContent = countRevising;
  if (elPending) elPending.textContent = countPending;
  if (elScheduled) elScheduled.textContent = countScheduled;
}

function handleDragStart(e, postId) {
  draggedPostId = postId;
  e.dataTransfer.setData("text/plain", postId);
}

function handleDragOver(e) {
  e.preventDefault();
  const col = e.currentTarget;
  col.classList.add("drag-over");
}

document.querySelectorAll(".kanban-column").forEach(col => {
  col.addEventListener("dragleave", () => col.classList.remove("drag-over"));
});

function handleDrop(e, targetStatus) {
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
    renderPostsTable();
    showToast(`Đã chuyển bài viết ${post.id} sang "${post.statusText}"!`, "success");
  }
}

function renderMemberProgressView() {
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
      <td>${revisingCount} bài</td>
      <td>${pendingCount} bài</td>
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

// --- VIEW 1: Posts Management Logic ---
function updateMetricsDisplay() {
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

function filterByTab(tab) {
  state.currentTab = tab;
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tab);
  });
  filterPosts();
}

function filterPosts() {
  const searchTerm = (document.getElementById("postFilterSearch")?.value || "").toLowerCase().trim();
  const statusFilter = document.getElementById("postFilterStatus")?.value || "";
  const authorFilter = document.getElementById("postFilterAuthor")?.value || "";

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

    return true;
  });

  renderPostsRows(filtered);
}

function resetFilters() {
  if (document.getElementById("postFilterSearch")) document.getElementById("postFilterSearch").value = "";
  if (document.getElementById("postFilterStatus")) document.getElementById("postFilterStatus").value = "";
  if (document.getElementById("postFilterAuthor")) document.getElementById("postFilterAuthor").value = "";
  state.currentTab = "all";
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === "all");
  });
  renderPostsTable();
}

function renderPostsTable() {
  filterPosts();
}

function renderPostsRows(posts) {
  const tbody = document.getElementById("postsTableBody");
  const emptyState = document.getElementById("postsEmptyState");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (posts.length === 0) {
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";

  posts.forEach(post => {
    const tr = document.createElement("tr");

    let statusBadgeClass = "badge-draft";
    if (post.status === "published") statusBadgeClass = "badge-published";
    else if (post.status === "scheduled") statusBadgeClass = "badge-scheduled";
    else if (post.status === "pending") statusBadgeClass = "badge-pending";
    else if (post.status === "revising") statusBadgeClass = "badge-revising";

    tr.innerHTML = `
      <td>
        <div class="table-post-identity">
          <div class="post-type-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="post-text-meta">
            <strong onclick="handlePostTitleClick('${post.id}')">${escapeHTML(post.title)}</strong>
            <span>${post.id} · ${escapeHTML(post.channels)}</span>
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
          <button class="action-icon-btn" onclick="openEditPost('${post.id}')" title="Chỉnh sửa">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
          </button>
          <button class="action-icon-btn danger" onclick="openDeleteModal('${post.id}')" title="Xóa bài viết">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function handlePostTitleClick(postId) {
  const post = state.posts.find(p => p.id === postId);
  if (!post) return;
  if (post.status === "pending") {
    state.activeApprovalPostId = postId;
    switchView("approvals");
  } else {
    openEditPost(postId);
  }
}

// --- VIEW 2: Editorial & Create/Edit Post Logic ---
function openCreatePost() {
  document.getElementById("editPostId").value = "";
  document.getElementById("editorTitleHeading").textContent = "Tạo bài viết mới";
  document.getElementById("editorBreadcrumbAction").textContent = "Tạo bài viết";
  document.getElementById("postTitleInput").value = "";
  document.getElementById("postCategorySelect").value = "Chăm sóc da";
  document.getElementById("postCampaignSelect").value = "Nâng niu làn da · Tháng 11";
  document.getElementById("postChannelsSelect").value = "Facebook & Instagram";
  document.getElementById("postScheduleTimeInput").value = "2026-11-09T08:00";
  document.getElementById("articleBodyContent").innerHTML = `
    <h2 style="font-family: 'Playfair Display', serif; font-size: 22px; color: #574b50; margin-bottom: 12px;">Tiêu đề đoạn mở đầu...</h2>
    <p style="margin-bottom: 12px;">Nhập nội dung chia sẻ cảm hứng và bí quyết làm đẹp tại đây...</p>
    <p style="color: #cc618a; font-weight: 500;">#BlossomBeauty</p>
  `;
  document.getElementById("mediaPreviewImg").src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80";
  document.getElementById("attachmentFileName").textContent = "blossom-editorial.jpg";
  document.getElementById("editorCurrentStatusBadge").textContent = "Bản nháp";
  document.getElementById("editorCurrentStatusBadge").className = "badge badge-draft";

  updateWordCount();
  updateChecklist();
  switchView("editor");
}

function openEditPost(postId) {
  const post = state.posts.find(p => p.id === postId);
  if (!post) return;

  document.getElementById("editPostId").value = post.id;
  document.getElementById("editorTitleHeading").textContent = "Chỉnh sửa bài viết";
  document.getElementById("editorBreadcrumbAction").textContent = `Chỉnh sửa / ${post.id}`;
  document.getElementById("postTitleInput").value = post.title;
  document.getElementById("postCategorySelect").value = post.category || "Chăm sóc da";
  document.getElementById("postCampaignSelect").value = post.campaign || "Nâng niu làn da · Tháng 11";
  document.getElementById("postChannelsSelect").value = post.channels || "Facebook & Instagram";
  document.getElementById("postAuthorInput").value = post.author;
  
  const formattedSchedule = post.scheduleDate ? `${post.scheduleDate}T${post.scheduleTime || '08:00'}` : "2026-11-05T08:00";
  document.getElementById("postScheduleTimeInput").value = formattedSchedule;

  document.getElementById("articleBodyContent").innerHTML = post.content || "";
  if (post.heroImage) {
    document.getElementById("mediaPreviewImg").src = post.heroImage;
  }

  const badge = document.getElementById("editorCurrentStatusBadge");
  badge.textContent = post.statusText;
  badge.className = `badge badge-${post.status}`;

  updateWordCount();
  updateChecklist();
  switchView("editor");
}

function savePostDraft() {
  const postId = document.getElementById("editPostId").value;
  const title = document.getElementById("postTitleInput").value.trim() || "Bản nháp chưa đặt tên";
  const category = document.getElementById("postCategorySelect").value;
  const campaign = document.getElementById("postCampaignSelect").value;
  const channels = document.getElementById("postChannelsSelect").value;
  const scheduleTimeRaw = document.getElementById("postScheduleTimeInput").value;
  const content = document.getElementById("articleBodyContent").innerHTML;
  const heroImage = document.getElementById("mediaPreviewImg").src;

  const [sDate, sTime] = scheduleTimeRaw.split("T");

  if (postId) {
    // Update existing
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
    // Create new
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
    document.getElementById("editPostId").value = newId;
    showToast(`Đã tạo bản nháp mới ${newId}!`, "success");
  }

  saveState();
  updateChecklist();
}

function submitPostForApproval() {
  const title = document.getElementById("postTitleInput").value.trim();
  if (!title) {
    showToast("Vui lòng nhập tiêu đề bài viết trước khi gửi duyệt!", "error");
    document.getElementById("postTitleInput").focus();
    return;
  }

  savePostDraft();
  const postId = document.getElementById("editPostId").value;
  const post = state.posts.find(p => p.id === postId);
  if (post) {
    post.status = "pending";
    post.statusText = "Chờ duyệt";
    post.submittedAt = "Vừa xong · " + new Date().toLocaleDateString("vi-VN");

    // Add notification
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
    setTimeout(() => switchView("approvals"), 400);
  }
}

function updateWordCount() {
  const content = document.getElementById("articleBodyContent")?.innerText || "";
  const charCount = content.length;
  const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
  const el = document.getElementById("charCountDisplay");
  if (el) {
    el.textContent = `${words} từ · ${charCount.toLocaleString("vi-VN")} ký tự`;
  }
}

function updateChecklist() {
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

function formatDoc(cmd, val = null) {
  document.execCommand(cmd, false, val);
  updateWordCount();
}

function addLink() {
  const url = prompt("Nhập địa chỉ liên kết (URL):", "https://");
  if (url) formatDoc("createLink", url);
}

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    document.getElementById("mediaPreviewImg").src = event.target.result;
    document.getElementById("attachmentFileName").textContent = file.name;
    document.getElementById("attachmentSpecs").textContent = `${(file.size / (1024 * 1024)).toFixed(1)} MB · Ảnh đại diện mới`;
    updateChecklist();
    showToast("Đã tải ảnh lên thành công!", "success");
  };
  reader.readAsDataURL(file);
}

function removeAttachedImage() {
  document.getElementById("mediaPreviewImg").src = "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80";
  document.getElementById("attachmentFileName").textContent = "chưa_có_ảnh.jpg";
  document.getElementById("attachmentSpecs").textContent = "Chưa chọn tệp ảnh";
  updateChecklist();
  showToast("Đã xóa ảnh đính kèm", "info");
}

// --- VIEW 3: Calendar Logic ---
function setCalendarMode(mode) {
  document.getElementById("btnViewMonth")?.classList.toggle("active", mode === "month");
  document.getElementById("btnViewWeek")?.classList.toggle("active", mode === "week");
  renderCalendar();
}

function changeMonth(delta) {
  state.calendarCurrentDate.setMonth(state.calendarCurrentDate.getMonth() + delta);
  renderCalendar();
}

function goToToday() {
  state.calendarCurrentDate = new Date(2026, 10, 4); // November 2026 current mock time
  renderCalendar();
}

function renderCalendar() {
  const grid = document.getElementById("calendarGridBody");
  const monthTitle = document.getElementById("currentCalendarMonthTitle");
  if (!grid) return;

  const year = state.calendarCurrentDate.getFullYear();
  const month = state.calendarCurrentDate.getMonth();

  if (monthTitle) {
    monthTitle.textContent = `Tháng ${month + 1}, ${year}`;
  }

  grid.innerHTML = "";

  // First day of month & number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevMonthLastDay = new Date(year, month, 0);

  // Monday-first indexing: 0 is Monday, 6 is Sunday
  let startDayOfWeek = firstDay.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  // Render preceding days from previous month
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay.getDate() - i;
    const cell = createCalendarCell(dayNum, true);
    grid.appendChild(cell);
  }

  // Channel filter
  const channelFilter = document.getElementById("calChannelFilter")?.value || "";

  // Render current month days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const isToday = (year === 2026 && month === 10 && d === 4);
    
    // Find posts scheduled for this day
    const dayPosts = state.posts.filter(p => {
      if (p.scheduleDate !== dateStr) return false;
      if (channelFilter && !p.channels.includes(channelFilter)) return false;
      return true;
    });

    const cell = createCalendarCell(d, false, isToday, dayPosts, dateStr);
    grid.appendChild(cell);
  }

  // Trailing days for grid completion
  const totalCells = startDayOfWeek + lastDay.getDate();
  const remainingCells = (7 - (totalCells % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const cell = createCalendarCell(d, true);
    grid.appendChild(cell);
  }
}

function createCalendarCell(dayNum, isOtherMonth, isToday = false, posts = [], dateStr = "") {
  const cell = document.createElement("div");
  cell.className = `calendar-cell ${isOtherMonth ? "other-month" : ""} ${isToday ? "today" : ""}`;

  const dayHeader = document.createElement("div");
  dayHeader.className = "day-header";
  dayHeader.innerHTML = `<span class="day-number">${dayNum}</span>`;
  cell.appendChild(dayHeader);

  if (posts && posts.length > 0) {
    posts.forEach(post => {
      const chip = document.createElement("div");
      chip.className = `calendar-post-chip status-${post.status}`;
      chip.title = `${post.title} (${post.scheduleTime || '08:00'})`;
      chip.innerHTML = `
        <span class="chip-title">${escapeHTML(post.title)}</span>
        <span class="chip-meta">${post.scheduleTime || '08:00'} · ${post.channels.split("&")[0].trim()}</span>
      `;
      chip.onclick = (e) => {
        e.stopPropagation();
        handlePostTitleClick(post.id);
      };
      cell.appendChild(chip);
    });
  }

  cell.onclick = () => {
    if (!isOtherMonth && dateStr) {
      openCreatePost();
      document.getElementById("postScheduleTimeInput").value = `${dateStr}T08:00`;
    }
  };

  return cell;
}

// --- VIEW 4: Approval Detail () Logic ---
function renderApprovalView(postId) {
  let post = state.posts.find(p => p.id === postId);
  if (!post) {
    post = state.posts.find(p => p.status === "pending") || state.posts[0];
  }
  if (!post) return;

  state.activeApprovalPostId = post.id;

  document.getElementById("approvalPostCode").textContent = post.id;
  document.getElementById("approvalTitle").textContent = post.title;
  document.getElementById("approvalCategoryRef").textContent = `${post.id} · ${post.category || "Chăm sóc da"}`;
  document.getElementById("approvalAuthor").textContent = post.author;
  document.getElementById("approvalSubmittedTime").textContent = post.submittedAt || `09:45 · ${post.displayDate}`;
  
  if (post.heroImage) {
    document.getElementById("approvalHeroImg").src = post.heroImage;
  }
  
  const statusBadge = document.getElementById("approvalStatusBadge");
  statusBadge.textContent = post.statusText;
  statusBadge.className = `badge badge-${post.status}`;

  // Side meta
  document.getElementById("apprSideAuthor").textContent = post.author;
  document.getElementById("apprSideChannels").textContent = post.channels;
  document.getElementById("apprSideCampaign").textContent = post.campaign || "Nâng niu làn da · Tháng 11";
  document.getElementById("apprSideSchedule").textContent = `${post.displayDate} · ${post.scheduleTime || '08:00'}`;

  // Quick switch list of other pending posts
  const quickList = document.getElementById("approvalQuickSwitchList");
  if (quickList) {
    quickList.innerHTML = "";
    const pendings = state.posts.filter(p => p.status === "pending");
    if (pendings.length === 0) {
      quickList.innerHTML = `<span style="font-size: 11px; color: #a4989d;">Không còn bài viết nào chờ duyệt</span>`;
    } else {
      pendings.forEach(p => {
        const item = document.createElement("div");
        item.className = "pending-list-item";
        item.innerHTML = `
          <strong>${escapeHTML(p.title)}</strong>
          <span>${p.id} · ${p.author}</span>
        `;
        item.onclick = () => renderApprovalView(p.id);
        quickList.appendChild(item);
      });
    }
  }
}

function approveCurrentPost() {
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
  renderApprovalView(post.id);
  showToast(`Đã phê duyệt bài viết ${post.id}! Trạng thái chuyển thành "Đã lên lịch".`, "success");
}

function openRevisionModal() {
  document.getElementById("revisionModal").classList.add("show");
}

function closeRevisionModal() {
  document.getElementById("revisionModal").classList.remove("show");
}

function submitRevisionFeedback() {
  const feedback = document.getElementById("revisionFeedbackText").value.trim();
  const post = state.posts.find(p => p.id === state.activeApprovalPostId);
  if (!post) return;

  post.status = "revising";
  post.statusText = "Đang chỉnh sửa";
  post.revisionFeedback = feedback;

  state.notifications.unshift({
    id: Date.now(),
    title: `Yêu cầu chỉnh sửa bài viết ${post.id}`,
    desc: `Quản trị viên đã yêu cầu chỉnh sửa: "${feedback || 'Cần hoàn thiện nội dung'}"`,
    time: "Vừa xong",
    unread: true,
    targetView: "posts"
  });

  saveState();
  closeRevisionModal();
  renderApprovalView(post.id);
  showToast(`Đã gửi yêu cầu chỉnh sửa bài viết ${post.id} tới tác giả!`, "info");
}

function downloadAttachmentSim() {
  showToast("Đang tải xuống tệp blossom-skincare-thang11.jpg (1,8 MB)...", "info");
}

// --- VIEW 5: Statistics & Report Logic ---
function updateStatsPeriod() {
  const period = document.getElementById("statPeriodSelect").value;
  showToast(`Đã cập nhật số liệu báo cáo cho: ${period}`, "info");
}

function exportReportData() {
  showToast("Đang xuất báo cáo thống kê định dạng Excel & PDF...", "success");
}

// --- VIEW 6: Notifications Logic ---
function renderNotificationsList() {
  const dropdownList = document.getElementById("notifDropdownList");
  const fullPageList = document.getElementById("notifFullPageList");

  if (dropdownList) dropdownList.innerHTML = "";
  if (fullPageList) fullPageList.innerHTML = "";

  state.notifications.forEach(notif => {
    // Dropdown item
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

    // Full page feed item
    if (fullPageList) {
      const feedItem = document.createElement("div");
      feedItem.className = `notif-feed-item ${notif.unread ? "unread" : ""}`;
      feedItem.innerHTML = `
        <div class="notif-feed-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </div>
        <div class="notif-feed-content">
          <h4>${escapeHTML(notif.title)}</h4>
          <p>${escapeHTML(notif.desc)}</p>
          <span class="notif-feed-time">${notif.time}</span>
        </div>
        ${notif.unread ? '<span class="badge badge-light">Mới</span>' : ''}
      `;
      feedItem.onclick = () => handleNotifClick(notif);
      fullPageList.appendChild(feedItem);
    }
  });

  updateNotifCounters();
}

function handleNotifClick(notif) {
  notif.unread = false;
  saveState();
  if (notif.targetPostId) {
    state.activeApprovalPostId = notif.targetPostId;
  }
  if (notif.targetView) {
    switchView(notif.targetView);
  }
}

function markAllNotifsRead() {
  state.notifications.forEach(n => n.unread = false);
  saveState();
  renderNotificationsList();
  showToast("Đã đánh dấu đã đọc tất cả thông báo!", "info");
}

function updateNotifCounters() {
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

// --- VIEW 7: User Management Logic ---
function renderUsersTable() {
  const tbody = document.getElementById("usersTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  state.users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="table-post-identity">
          <div class="avatar avatar-sm">${user.avatar}</div>
          <div class="post-text-meta">
            <strong>${escapeHTML(user.name)}</strong>
            <span>ID: #00${user.id}</span>
          </div>
        </div>
      </td>
      <td>${escapeHTML(user.email)}</td>
      <td><span class="badge ${user.role === 'Quản trị viên' ? 'badge-published' : 'badge-light'}">${user.role}</span></td>
      <td><strong>${user.postCount}</strong> bài viết</td>
      <td><span class="badge badge-published">${user.status}</span></td>
      <td style="text-align: right;">
        <button class="action-icon-btn" onclick="showToast('Chức năng sửa thông tin thành viên', 'info')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openAddUserModal() {
  document.getElementById("addUserModal").classList.add("show");
}

function closeAddUserModal() {
  document.getElementById("addUserModal").classList.remove("show");
}

function saveNewUser() {
  const name = document.getElementById("newUserName").value.trim();
  const email = document.getElementById("newUserEmail").value.trim();
  const role = document.getElementById("newUserRole").value;

  if (!name || !email) {
    showToast("Vui lòng điền họ tên và email!", "error");
    return;
  }

  const initials = name.split(" ").map(w => w[0]).slice(-2).join("").toUpperCase();
  const newUser = {
    id: state.users.length + 1,
    name,
    email,
    role,
    postCount: 0,
    status: "Hoạt động",
    avatar: initials || "US"
  };

  state.users.push(newUser);
  saveState();
  closeAddUserModal();
  renderUsersTable();
  showToast(`Đã thêm thành viên ${name} (${role}) thành công!`, "success");
}

// --- Delete Modal () Logic ---
function openDeleteModal(postId) {
  state.deleteTargetPostId = postId;
  const post = state.posts.find(p => p.id === postId);
  if (post) {
    document.getElementById("deletePostTitleDisplay").textContent = `"${post.title}"`;
  }
  document.getElementById("deleteModal").classList.add("show");
}

function closeDeleteModal() {
  document.getElementById("deleteModal").classList.remove("show");
  state.deleteTargetPostId = null;
}

function confirmDeletePost() {
  if (!state.deleteTargetPostId) return;

  const postId = state.deleteTargetPostId;
  const idx = state.posts.findIndex(p => p.id === postId);
  if (idx !== -1) {
    const deleted = state.posts.splice(idx, 1)[0];
    saveState();
    closeDeleteModal();
    renderPostsTable();
    showToast(`Đã xóa bài viết ${deleted.id} thành công!`, "info");
  }
}

// --- Reset to Figma Default Data ---
function resetToFigmaDefaultData() {
  if (confirm("Khôi phục toàn bộ bài viết và dữ liệu mẫu về thiết kế gốc trên Figma?")) {
    localStorage.removeItem("blossom_posts");
    localStorage.removeItem("blossom_users");
    localStorage.removeItem("blossom_notifs");
    state.posts = JSON.parse(JSON.stringify(DEFAULT_POSTS));
    state.users = JSON.parse(JSON.stringify(DEFAULT_USERS));
    state.notifications = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS));
    saveState();
    renderPostsTable();
    renderCalendar();
    renderApprovalView(state.activeApprovalPostId);
    showToast("Đã khôi phục dữ liệu mẫu gốc từ Figma thành công!", "success");
  }
}

function exportDataJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const dlAnchor = document.createElement("a");
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "blossom_mock_data.json");
  dlAnchor.click();
  showToast("Đã xuất file blossom_mock_data.json!", "success");
}

// --- Dropdowns & Shortcuts ---
function toggleNotifDropdown(e) {
  e.stopPropagation();
  const popover = document.getElementById("notifPopover");
  const userDropdown = document.getElementById("userDropdown");
  userDropdown?.classList.remove("show");
  popover?.classList.toggle("show");
}

function toggleUserDropdown(e) {
  e.stopPropagation();
  const userDropdown = document.getElementById("userDropdown");
  const popover = document.getElementById("notifPopover");
  popover?.classList.remove("show");
  userDropdown?.classList.toggle("show");
}

function closeAllDropdowns() {
  document.getElementById("notifPopover")?.classList.remove("show");
  document.getElementById("userDropdown")?.classList.remove("show");
}

document.addEventListener("click", closeAllDropdowns);

function setupKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // ⌘ K or Ctrl + K for search
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      document.getElementById("globalSearchInput")?.focus();
    }
    // Escape closes modals
    if (e.key === "Escape") {
      closeDeleteModal();
      closeRevisionModal();
      closeAddUserModal();
      closeAllDropdowns();
    }
  });
}

function handleGlobalSearch(term) {
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

function handleLogout() {
  if (confirm("Bạn có muốn đăng xuất khỏi Blossom Beauty Store?")) {
    showToast("Đã đăng xuất tài khoản", "info");
  }
}

function showHelpModal() {
  alert("Trung tâm hỗ trợ Blossom Beauty Store:\n- Hotline: 1900 8888\n- Email: support@blossom.vn\n- Phiên bản: 1.0 (Bản dựng theo thiết kế Figma)");
}

// --- Toast Notification Helper ---
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  if (type === "success") {
    iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  } else if (type === "error") {
    iconSvg = '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  }

  toast.innerHTML = `${iconSvg}<span>${escapeHTML(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    if (toast.remove) toast.remove();
    else if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 4000);
}

// --- Utilities ---
function formatDateDisplay(yyyyMmDd) {
  if (!yyyyMmDd) return "";
  const parts = yyyyMmDd.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return yyyyMmDd;
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
