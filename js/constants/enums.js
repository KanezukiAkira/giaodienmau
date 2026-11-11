/**
 * System Enums & Constants
 * Synchronized with Backend SDD v1.1
 */

export const ROLES = {
  MANAGER: "MANAGER",
  STAFF: "STAFF"
};

export const POST_STATUS = {
  DRAFT: "Draft",
  PENDING: "Pending",
  APPROVED: "Approved",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  REJECTED: "Rejected"
};

export const PLATFORMS = {
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok"
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "blossom_access_token",
  USER_INFO: "blossom_current_user",
  LOGGED_IN: "blossom_logged_in",
  POSTS: "blossom_posts",
  USERS: "blossom_users",
  NOTIFS: "blossom_notifs"
};
