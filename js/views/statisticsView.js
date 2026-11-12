/**
 * View: Statistics & Reporting ()
 */
import { state } from '../core/state.js';
import { showToast } from '../components/toast.js';
import { analyticsApi } from '../api/analyticsApi.js';
import { getCurrentUser, isStaff } from '../core/permissions.js';

export async function updateStatsPeriod() {
  const select = document.getElementById("statPeriodSelect");
  const periodText = (select && select.options && select.selectedIndex >= 0 && select.options[select.selectedIndex])
    ? select.options[select.selectedIndex].text
    : (select?.value || "Thời gian thực");

  const elPub = document.getElementById("statKpiPublished");
  const elPubSub = document.getElementById("statKpiPublishedSub");
  const elReach = document.getElementById("statKpiReach");
  const elReachSub = document.getElementById("statKpiReachSub");
  const elEngage = document.getElementById("statKpiEngagement");
  const elEngageSub = document.getElementById("statKpiEngagementSub");
  const elRate = document.getElementById("statKpiRate");
  const elRateSub = document.getElementById("statKpiRateSub");

  let publishedCount = 0;
  let totalReach = 0;
  let totalEngagement = 0;

  try {
    const summary = await analyticsApi.getDashboardSummary();
    if (summary) {
      publishedCount = summary.total_published_posts || 0;
      totalReach = summary.total_reach || 0;
      totalEngagement = summary.total_engagement || 0;
    }
  } catch (err) {
    // If user lacks permission or offline, calculate directly from active posts
    const publishedPosts = state.posts.filter(p => p.status === "published");
    publishedCount = publishedPosts.length;
    publishedPosts.forEach(p => {
      const reachNum = parseInt(String(p.reach || "").replace(/\D/g, ""), 10) || 0;
      const engageNum = parseInt(String(p.engagement || "").replace(/\D/g, ""), 10) || 0;
      totalReach += reachNum;
      totalEngagement += engageNum;
    });
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return String(num);
  };

  const rate = totalReach > 0 ? ((totalEngagement / totalReach) * 100).toFixed(2) + "%" : "0.00%";

  if (elPub) elPub.textContent = String(publishedCount);
  if (elPubSub) elPubSub.textContent = "Số bài viết đã xuất bản thực tế";
  if (elReach) elReach.textContent = formatNumber(totalReach);
  if (elReachSub) elReachSub.textContent = "Tổng lượt tiếp cận tích lũy";
  if (elEngage) elEngage.textContent = formatNumber(totalEngagement);
  if (elEngageSub) elEngageSub.textContent = "Tổng lượt tương tác (Like, Comment, Share)";
  if (elRate) elRate.textContent = rate;
  if (elRateSub) elRateSub.textContent = "Tỷ lệ tương tác trung bình";

  showToast(`Đã cập nhật số liệu: ${periodText}`, "info");
}

export function exportReportData() {
  const user = getCurrentUser();
  if (isStaff(user)) {
    showToast("Chỉ Marketing Manager mới có quyền xuất báo cáo số liệu!", "warning");
    return;
  }
  try {
    const rows = [
      ["Mã bài viết", "Tiêu đề bài viết", "Tác giả", "Chuyên mục", "Kênh đăng", "Trạng thái", "Ngày đăng", "Lượt tiếp cận", "Lượt tương tác", "Tỷ lệ tương tác"],
      ...state.posts.map(p => [
        p.id,
        `"${(p.title || '').replace(/"/g, '""')}"`,
        `"${p.author || ''}"`,
        `"${p.category || 'Chăm sóc da'}"`,
        `"${p.channels || 'Facebook & Instagram'}"`,
        `"${p.statusText || p.status}"`,
        `"${p.displayDate || ''}"`,
        p.reach || "0",
        p.engagement || "0",
        p.engagementRate || "0%"
      ])
    ];

    const csvContent = "\uFEFF" + rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `blossom_bao_cao_thong_ke_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("Đã xuất báo cáo thống kê định dạng CSV thành công!", "success");
  } catch (err) {
    showToast("Đang chuẩn bị báo cáo thống kê Excel & PDF...", "info");
  }
}

export function initChartTooltips() {
  const tooltip = document.getElementById("chartTooltip");
  const plotArea = document.querySelector ? document.querySelector(".chart-plot-area") : null;
  if (!tooltip || !plotArea) return;

  const points = document.querySelectorAll(".chart-point");
  points.forEach(pt => {
    pt.addEventListener("mouseenter", (e) => {
      const info = pt.getAttribute("data-info");
      if (!info) return;

      tooltip.textContent = info;
      tooltip.style.display = "block";

      const ptRect = pt.getBoundingClientRect();
      const plotRect = plotArea.getBoundingClientRect();

      const left = ptRect.left - plotRect.left + (ptRect.width / 2);
      const top = ptRect.top - plotRect.top;

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    });

    pt.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });
  });
}
