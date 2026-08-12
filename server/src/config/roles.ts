/**
 * Administrator privilege levels.
 *
 * These strings are the single source of truth for the `admins.role` column,
 * the `authorize()` guards on the admin API, and the ENUM created by the
 * `add-admin-role` migration. Import them instead of repeating literals so a
 * typo cannot silently open a route to everyone.
 */
export const SUPER_ADMIN = 'super-admin';
export const ADMIN = 'admin';

/** Every role allowed to hold an admin-purpose session, most privileged first. */
export const ADMIN_ROLES = [SUPER_ADMIN, ADMIN] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

/** Narrows an untrusted value (a database column, a JWT claim) to a known role. */
export function isAdminRole(value: unknown): value is AdminRole {
  return (
    typeof value === 'string' && (ADMIN_ROLES as readonly string[]).includes(value)
  );
}
