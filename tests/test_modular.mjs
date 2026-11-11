// Scratch automated test suite for modular ES Modules architecture
import fs from 'fs';
import path from 'path';

// Read index.html
const htmlPath = 'index.html';
const html = fs.readFileSync(htmlPath, 'utf8');

console.log("=== STEP 1: VERIFYING DOM ELEMENT IDS REFERENCED IN JS ===");

// Extract all getElementById calls in js/
const jsDir = 'js';
function getJsFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getJsFiles(fullPath));
    } else if (file.endsWith('.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

const jsFiles = getJsFiles(jsDir);
const idRegex = /getElementById\(["']([^"']+)["']\)/g;
const referencedIds = new Set();

jsFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = idRegex.exec(content)) !== null) {
    referencedIds.add(match[1]);
  }
});

console.log(`Found ${referencedIds.size} unique DOM IDs referenced in JS files.`);

const missingIds = [];
referencedIds.forEach(id => {
  if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) {
    missingIds.push(id);
  }
});

if (missingIds.length > 0) {
  console.error("ERROR: Missing DOM IDs in index.html:", missingIds);
} else {
  console.log("SUCCESS: 100% of DOM IDs referenced in JS exist in index.html!");
}

console.log("\n=== STEP 2: SIMULATING BROWSER RUNTIME WITH JSDOM-LIKE ENVIRONMENT ===");

// Simple mock DOM
class MockElement {
  constructor(tag, id = "", className = "") {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.className = className;
    this.classList = {
      _classes: new Set(className ? className.split(/\s+/) : []),
      add: (...c) => c.forEach(x => this.classList._classes.add(x)),
      remove: (...c) => c.forEach(x => this.classList._classes.delete(x)),
      toggle: (c, force) => {
        if (force === undefined) {
          if (this.classList._classes.has(c)) this.classList._classes.delete(c);
          else this.classList._classes.add(c);
        } else if (force) {
          this.classList._classes.add(c);
        } else {
          this.classList._classes.delete(c);
        }
      },
      contains: (c) => this.classList._classes.has(c)
    };
    this.children = [];
    this.innerHTML = "";
    this.textContent = "";
    this.value = "";
    this.style = {};
    this.src = "";
    this.dataset = {};
  }
  appendChild(child) {
    this.children.push(child);
    return child;
  }
  removeChild(child) {
    this.children = this.children.filter(c => c !== child);
  }
  remove() {
    if (this.parentNode) this.parentNode.removeChild(this);
  }
  getAttribute(name) {
    if (name === 'data-view') return this.dataset.view || "";
    if (name === 'data-tab') return this.dataset.tab || "";
    return "";
  }
  setAttribute(name, val) {
    if (name.startsWith('data-')) this.dataset[name.slice(5)] = val;
  }
  addEventListener(event, fn) {}
  focus() {}
}

const domElements = new Map();

// Parse IDs from HTML and populate mock elements
const allIdsInHtml = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
allIdsInHtml.forEach(id => {
  domElements.set(id, new MockElement('div', id));
});

// Setup global mock window / document
global.window = global;
global.document = {
  getElementById: (id) => domElements.get(id) || null,
  createElement: (tag) => new MockElement(tag),
  querySelectorAll: (selector) => {
    if (selector === ".view-panel") {
      return ["posts", "editor", "dashboard", "calendar", "approvals", "statistics", "notifications", "users"]
        .map(v => domElements.get(`view-${v}`) || new MockElement('div', `view-${v}`));
    }
    if (selector === ".nav-item") {
      return ["posts", "dashboard", "calendar", "approvals", "statistics", "notifications", "users"].map(v => {
        const el = new MockElement('button');
        el.dataset.view = v;
        return el;
      });
    }
    if (selector === ".tab-btn") {
      return ["all", "mine", "archived"].map(t => {
        const el = new MockElement('button');
        el.dataset.tab = t;
        return el;
      });
    }
    if (selector === ".kanban-column") {
      return [new MockElement('div'), new MockElement('div'), new MockElement('div'), new MockElement('div')];
    }
    return [];
  },
  querySelector: (selector) => new MockElement('div'),
  addEventListener: () => {}
};
global.localStorage = {
  _store: {},
  getItem: (k) => global.localStorage._store[k] || null,
  setItem: (k, v) => { global.localStorage._store[k] = v; },
  removeItem: (k) => { delete global.localStorage._store[k]; }
};
global.confirm = () => true;
global.alert = () => {};
global.scrollTo = () => {};

// Now dynamically import main.js!
console.log("Loading js/main.js dynamically as ES Module...");
await import('../js/main.js');

console.log("\n=== STEP 3: VERIFYING INLINE HANDLER EXPOSURES ON WINDOW ===");
const inlineHandlers = [
  "addLink",
  "approveCurrentPost",
  "changeMonth",
  "closeAddUserModal",
  "closeDeleteModal",
  "closeRevisionModal",
  "confirmDeletePost",
  "downloadAttachmentSim",
  "exportDataJSON",
  "exportReportData",
  "filterByTab",
  "filterKanbanBoard",
  "filterPosts",
  "formatDoc",
  "goToToday",
  "handleDragOver",
  "handleGlobalSearch",
  "handleImageUpload",
  "handleLogout",
  "markAllNotifsRead",
  "openAddUserModal",
  "openCreatePost",
  "openRevisionModal",
  "removeAttachedImage",
  "renderCalendar",
  "resetFilters",
  "resetToFigmaDefaultData",
  "saveNewUser",
  "savePostDraft",
  "setBoardTab",
  "setCalendarMode",
  "showHelpModal",
  "submitPostForApproval",
  "submitRevisionFeedback",
  "switchView",
  "toggleNotifDropdown",
  "toggleUserDropdown",
  "updateChecklist",
  "updateStatsPeriod",
  "updateWordCount",
  "handlePostTitleClick",
  "openEditPost",
  "openDeleteModal",
  "selectRevisionDecision",
  "openSubmitApprovalModal",
  "closeSubmitApprovalModal",
  "confirmSubmitPostForApproval",
  "commitPostSubmission",
  "selectUserForDetail",
  "filterUsersTable",
  "updateSelectedUserRole",
  "toggleUserLoginStatus",
  "saveSelectedUserDetails",
  "toggleLockSelectedUser",
  "deleteSelectedUser",
  "initChartTooltips",
  "filterNotifsByTab"
];

let missingHandlers = 0;
inlineHandlers.forEach(name => {
  if (typeof window[name] !== 'function') {
    console.error(`MISSING HANDLER: window.${name} is ${typeof window[name]}`);
    missingHandlers++;
  }
});

if (missingHandlers === 0) {
  console.log(`SUCCESS: All ${inlineHandlers.length} inline handlers are verified present on window!`);
} else {
  console.error(`FAILED: ${missingHandlers} handlers are not attached to window.`);
  process.exit(1);
}

console.log("\n=== STEP 4: EXECUTING FEATURE INTERACTIONS ===");
try {
  // Test Views
  window.switchView("dashboard");
  console.log("✓ switchView('dashboard') passed");

  window.setBoardTab("member");
  console.log("✓ setBoardTab('member') passed");
  window.setBoardTab("board");
  console.log("✓ setBoardTab('board') passed");

  window.switchView("calendar");
  window.changeMonth(1);
  window.goToToday();
  console.log("✓ Calendar navigation passed");

  window.switchView("approvals");
  window.renderApprovalView("BL-0127");
  window.approveCurrentPost();
  console.log("✓ Approvals workflow passed");

  window.switchView("posts");
  window.filterByTab("mine");
  window.filterByTab("all");
  console.log("✓ Post filtering passed");

  window.openCreatePost();
  const titleInput = domElements.get("postTitleInput");
  if (titleInput) titleInput.value = "Bài viết kiểm thử tự động";
  window.savePostDraft();
  console.log("✓ Post draft creation passed");

  window.markAllNotifsRead();
  window.filterNotifsByTab("unread");
  window.filterNotifsByTab("all");
  console.log("✓ Notifications workflow and tabs passed");

  window.setCalendarMode("week");
  window.setCalendarMode("month");
  console.log("✓ Calendar week/month mode passed");

  window.updateStatsPeriod();
  window.exportReportData();
  console.log("✓ Statistics period update and report export passed");

  window.openConfirmPublishModal("BL-0001");
  window.closeConfirmPublishModal();
  window.openMetricsModal("BL-0001");
  window.closeMetricsModal();
  window.openChangePasswordModal();
  window.closeChangePasswordModal();
  console.log("✓ Confirm Publish, Metrics and Change Password modals passed");

  window.showToast("Kiểm thử tự động thành công!", "success");
  console.log("✓ Toast notification passed");

  console.log("\n🎉 ALL MODULAR INTEGRATION TESTS PASSED 100%!");
} catch (err) {
  console.error("Test execution failure:", err);
  process.exit(1);
}
