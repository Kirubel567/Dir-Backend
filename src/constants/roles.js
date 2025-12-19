export const USER_ROLES = {
  OWNER: "owner",        // Full repo control
  CORE: "core",          // Can invite, edit, manage
  CONTRIBUTOR: "contributor", // Can create messages, tasks
  VIEWER: "viewer",      // Read-only access
};

export const ROLE_PERMISSIONS = {
  owner: ["read", "write", "delete", "manage_members", "manage_settings"],
  core: ["read", "write", "delete", "manage_members"],
  contributor: ["read", "write", "comment"],
  viewer: ["read"],
};

export const PERMISSION_LEVELS = {
  read: 1,
  write: 2,
  delete: 3,
  manage_members: 4,
  manage_settings: 5,
};