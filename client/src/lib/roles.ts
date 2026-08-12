/**
 * Administrator privilege levels, mirroring `admins.role` on the API.
 *
 * These helpers only decide what the dashboard *shows*. Every restriction is
 * enforced again by the API, which reads the role from the database rather
 * than from anything the browser sends — hiding a button is a courtesy, not
 * the security boundary.
 *
 * Kept free of `"use client"` so the Next.js route handlers under
 * `app/api/admin` can share it with the client components.
 */
export const SUPER_ADMIN = "super-admin";
export const ADMIN = "admin";

export const ADMIN_ROLES = [SUPER_ADMIN, ADMIN] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

/** True for any role allowed to hold an admin session. */
export function isAdminRole(role: unknown): role is AdminRole {
  return typeof role === "string" && (ADMIN_ROLES as readonly string[]).includes(role);
}

/** True only for the role with full create and delete access. */
export function isSuperAdminRole(role: unknown): boolean {
  return role === SUPER_ADMIN;
}

/** Human-readable label for a role, for tables and badges. */
export function adminRoleLabel(role: unknown): string {
  if (role === SUPER_ADMIN) return "Super administrator";
  if (role === ADMIN) return "Administrator";
  return "Unknown role";
}
