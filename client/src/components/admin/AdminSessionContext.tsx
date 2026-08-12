"use client";

import { createContext, useContext, useMemo } from "react";
import type { AdminUser } from "@/lib/admin-api";
import { type AdminRole, isSuperAdminRole } from "@/lib/roles";

type AdminSessionValue = {
  user: AdminUser | null;
  role: AdminRole | null;
  /** True only when the signed-in account may create and delete records. */
  isSuperAdmin: boolean;
};

/*
 * Defaults to the *least* privileged answer. If a component ever renders
 * outside the provider, it hides create and delete controls rather than
 * offering actions the API would refuse.
 */
const FALLBACK: AdminSessionValue = {
  user: null,
  role: null,
  isSuperAdmin: false,
};

const AdminSessionContext = createContext<AdminSessionValue>(FALLBACK);

/**
 * Publishes the verified session — including its privilege level — to the
 * dashboard. The admin layout already loads the account from
 * `/api/admin/session`, so this shares that one result instead of every table
 * asking again.
 */
export function AdminSessionProvider({
  user,
  children,
}: {
  user: AdminUser | null;
  children: React.ReactNode;
}) {
  const value = useMemo<AdminSessionValue>(
    () => ({
      user,
      role: user?.role ?? null,
      isSuperAdmin: isSuperAdminRole(user?.role),
    }),
    [user],
  );

  return (
    <AdminSessionContext.Provider value={value}>
      {children}
    </AdminSessionContext.Provider>
  );
}

/** Reads the signed-in administrator and what they are allowed to do. */
export function useAdminSession(): AdminSessionValue {
  return useContext(AdminSessionContext);
}
