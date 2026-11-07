/**
 * View: Editorial Calendar (Figma FR-11)
 */
import { state } from '../core/state.js';
import { escapeHTML } from '../utils/formatters.js';
import { openCreatePost } from './editorView.js';
import { handlePostTitleClick } from './postsView.js';
import { showToast } from '../components/toast.js';

let calendarMode = "month";

export function setCalendarMode(mode) {
  calendarMode = mode;
  document.getElementById("btnViewMonth")?.classList.toggle("active", mode === "month");
  document.getElementById("btnViewWeek")?.classList.toggle("active", mode === "week");
  renderCalendar();
}

export function changeMonth(delta) {
  if (calendarMode === "week") {
    state.calendarCurrentDate.setDate(state.calendarCurrentDate.getDate() + delta * 7);
  } else {
    state.calendarCurrentDate.setMonth(state.calendarCurrentDate.getMonth() + delta);
  }
  renderCalendar();
}

export function goToToday() {
  state.calendarCurrentDate = new Date(2026, 10, 4); // November 4, 2026 current mock time
  renderCalendar();
  showToast("Đã chuyển về ngày hôm nay (04/11/2026)", "info");
}

export function renderCalendar() {
  const grid = document.getElementById("calendarGridBody");
  const monthTitle = document.getElementById("currentCalendarMonthTitle");
  if (!grid) return;

  const year = state.calendarCurrentDate.getFullYear();
  const month = state.calendarCurrentDate.getMonth();
  const channelFilter = document.getElementById("calChannelFilter")?.value || "";

  grid.innerHTML = "";

  if (calendarMode === "week") {
    // Week Mode: Find Monday of the current week
    const current = new Date(state.calendarCurrentDate);
    let day = current.getDay();
    let diff = current.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(current.setDate(diff));

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    if (monthTitle) {
      monthTitle.textContent = `Tuần: ${monday.getDate()}/${monday.getMonth() + 1} - ${sunday.getDate()}/${sunday.getMonth() + 1}, ${sunday.getFullYear()}`;
    }

    grid.style.gridTemplateRows = "repeat(1, minmax(280px, auto))";

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dYear = d.getFullYear();
      const dMonth = d.getMonth();
      const dDate = d.getDate();

      const dateStr = `${dYear}-${String(dMonth + 1).padStart(2, "0")}-${String(dDate).padStart(2, "0")}`;
      const isToday = (dYear === 2026 && dMonth === 10 && dDate === 4);

      const dayPosts = state.posts.filter(p => {
        if (p.scheduleDate !== dateStr) return false;
        if (channelFilter && !p.channels.includes(channelFilter)) return false;
        return true;
      });

      const cell = createCalendarCell(dDate, false, isToday, dayPosts, dateStr);
      grid.appendChild(cell);
    }
  } else {
    // Month Mode
    grid.style.gridTemplateRows = "repeat(5, minmax(110px, 1fr))";

    if (monthTitle) {
      monthTitle.textContent = `Tháng ${month + 1}, ${year}`;
    }

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
}

export function createCalendarCell(dayNum, isOtherMonth, isToday = false, posts = [], dateStr = "") {
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
        <span class="chip-meta">${post.scheduleTime || '08:00'} · ${(post.channels || "FB").split("&")[0].trim()}</span>
      `;
      chip.onclick = (e) => {
        e.stopPropagation();
        if (window.handlePostTitleClick) {
          window.handlePostTitleClick(post.id);
        } else {
          handlePostTitleClick(post.id);
        }
      };
      cell.appendChild(chip);
    });
  }

  cell.onclick = () => {
    if (!isOtherMonth && dateStr) {
      if (window.openCreatePost) {
        window.openCreatePost();
      } else {
        openCreatePost();
      }
      const scheduleInput = document.getElementById("postScheduleTimeInput");
      if (scheduleInput) {
        scheduleInput.value = `${dateStr}T08:00`;
      }
      showToast(`Tạo bài viết mới cho ngày ${dateStr}`, "info");
    }
  };

  return cell;
}
