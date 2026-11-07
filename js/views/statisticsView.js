/**
 * View: Statistics & Reporting ()
 */
import { state } from '../core/state.js';
import { showToast } from '../components/toast.js';

export function updateStatsPeriod() {
  const select = document.getElementById("statPeriodSelect");
  const period = select?.value || "2026-11";

  const elPub = document.getElementById("statKpiPublished");
  const elPubSub = document.getElementById("statKpiPublishedSub");
  const elReach = document.getElementById("statKpiReach");
  const elReachSub = document.getElementById("statKpiReachSub");
  const elEngage = document.getElementById("statKpiEngagement");
  const elEngageSub = document.getElementById("statKpiEngagementSub");
  const elRate = document.getElementById("statKpiRate");
  const elRateSub = document.getElementById("statKpiRateSub");

  if (period === "2026-11") {
    if (elPub) elPub.textContent = "96";
    if (elPubSub) elPubSub.textContent = "↑ 15,2% so với tháng trước";
    if (elReach) elReach.textContent = "248,6K";
    if (elReachSub) elReachSub.textContent = "↑ 18,4% so với tháng trước";
    if (elEngage) elEngage.textContent = "24,8K";
    if (elEngageSub) elEngageSub.textContent = "↑ 6,4% so với tháng trước";
    if (elRate) elRate.textContent = "9,98%";
    if (elRateSub) elRateSub.textContent = "↑ 1,2% so với tháng trước";
    showToast("Đã cập nhật số liệu: Tháng 11, 2026", "info");
  } else if (period === "2026-10") {
    if (elPub) elPub.textContent = "84";
    if (elPubSub) elPubSub.textContent = "↑ 12,0% so với tháng 9";
    if (elReach) elReach.textContent = "210,3K";
    if (elReachSub) elReachSub.textContent = "↑ 14,2% so với tháng 9";
    if (elEngage) elEngage.textContent = "21,5K";
    if (elEngageSub) elEngageSub.textContent = "↑ 5,1% so với tháng 9";
    if (elRate) elRate.textContent = "10,22%";
    if (elRateSub) elRateSub.textContent = "↑ 0,8% so với tháng 9";
    showToast("Đã cập nhật số liệu: Tháng 10, 2026", "info");
  } else if (period === "2026-q3") {
    if (elPub) elPub.textContent = "250";
    if (elPubSub) elPubSub.textContent = "↑ 28,5% so với Quý 2";
    if (elReach) elReach.textContent = "620,5K";
    if (elReachSub) elReachSub.textContent = "↑ 31,2% so với Quý 2";
    if (elEngage) elEngage.textContent = "64,1K";
    if (elEngageSub) elEngageSub.textContent = "↑ 19,4% so với Quý 2";
    if (elRate) elRate.textContent = "10,33%";
    if (elRateSub) elRateSub.textContent = "↑ 1,5% so với Quý 2";
    showToast("Đã cập nhật số liệu: Quý 3, 2026", "info");
  }
}

export function exportReportData() {
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
        p.reach || "12.840",
        p.engagement || "1.148",
        p.engagementRate || "8,94%"
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
