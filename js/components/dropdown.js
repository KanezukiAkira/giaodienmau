/**
 * Dropdowns & Popovers
 */

export function toggleNotifDropdown(e) {
  if (e) e.stopPropagation();
  const popover = document.getElementById("notifPopover");
  const userDropdown = document.getElementById("userDropdown");
  userDropdown?.classList.remove("show");
  popover?.classList.toggle("show");
}

export function toggleUserDropdown(e) {
  if (e) e.stopPropagation();
  const userDropdown = document.getElementById("userDropdown");
  const popover = document.getElementById("notifPopover");
  popover?.classList.remove("show");
  userDropdown?.classList.toggle("show");
}

export function closeAllDropdowns() {
  document.getElementById("notifPopover")?.classList.remove("show");
  document.getElementById("userDropdown")?.classList.remove("show");
}
