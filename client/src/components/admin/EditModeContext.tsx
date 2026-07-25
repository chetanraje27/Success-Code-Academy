"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AdminUser } from "@/lib/admin-api";

type EditModeContextValue = {
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (on: boolean) => void;
  toggleEditMode: () => void;
  refreshKey: number;
  bumpRefresh: () => void;
  leadsOpen: boolean;
  setLeadsOpen: (open: boolean) => void;
  user: AdminUser | null;
  refreshAuth: () => void;
};

const EditModeContext = createContext<EditModeContextValue | null>(null);
const EDIT_MODE_KEY = "sca_edit_mode";

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [editMode, setEditModeState] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [leadsOpen, setLeadsOpen] = useState(false);

  const refreshAuth = useCallback(() => {
    fetch("/api/admin/session", {
      credentials: "same-origin",
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) return null;
        const payload = (await response.json()) as {
          data?: { user?: AdminUser };
        };
        return payload.data?.user?.role === "admin"
          ? payload.data.user
          : null;
      })
      .then((nextUser) => {
        setUser(nextUser);
        if (!nextUser) {
          setEditModeState(false);
          setLeadsOpen(false);
        }
      })
      .catch(() => {
        setUser(null);
        setEditModeState(false);
        setLeadsOpen(false);
      });
  }, []);

  useEffect(() => {
    refreshAuth();
    const onAuth = () => refreshAuth();
    const onContent = () => setRefreshKey((key) => key + 1);
    window.addEventListener("admin-session-expired", onAuth);
    window.addEventListener("admin-content-changed", onContent);
    return () => {
      window.removeEventListener("admin-session-expired", onAuth);
      window.removeEventListener("admin-content-changed", onContent);
    };
  }, [refreshAuth]);

  useEffect(() => {
    if (!user) return;
    try {
      // Restore a user-controlled browser preference after auth verification.
      const requestedByDashboard =
        new URLSearchParams(window.location.search).get("edit") === "1";
      if (requestedByDashboard) {
        sessionStorage.setItem(EDIT_MODE_KEY, "1");
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditModeState(
        requestedByDashboard || sessionStorage.getItem(EDIT_MODE_KEY) === "1",
      );
    } catch {
      setEditModeState(false);
    }
  }, [user]);

  const setEditMode = useCallback(
    (on: boolean) => {
      if (!user) {
        setEditModeState(false);
        return;
      }
      setEditModeState(on);
      try {
        sessionStorage.setItem(EDIT_MODE_KEY, on ? "1" : "0");
      } catch {
        // Session storage is an optional convenience only.
      }
    },
    [user],
  );

  const toggleEditMode = useCallback(() => {
    setEditMode(!editMode);
  }, [editMode, setEditMode]);

  const bumpRefresh = useCallback(() => {
    setRefreshKey((key) => key + 1);
    window.dispatchEvent(new Event("admin-content-changed"));
  }, []);

  const value = useMemo(
    () => ({
      isAdmin: Boolean(user),
      editMode: Boolean(user) && editMode,
      setEditMode,
      toggleEditMode,
      refreshKey,
      bumpRefresh,
      leadsOpen,
      setLeadsOpen,
      user,
      refreshAuth,
    }),
    [
      editMode,
      bumpRefresh,
      leadsOpen,
      refreshAuth,
      refreshKey,
      setEditMode,
      toggleEditMode,
      user,
    ],
  );

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error("useEditMode must be used within EditModeProvider");
  }
  return context;
}

export function useEditModeOptional(): EditModeContextValue {
  return (
    useContext(EditModeContext) || {
      isAdmin: false,
      editMode: false,
      setEditMode: () => undefined,
      toggleEditMode: () => undefined,
      refreshKey: 0,
      bumpRefresh: () => undefined,
      leadsOpen: false,
      setLeadsOpen: () => undefined,
      user: null,
      refreshAuth: () => undefined,
    }
  );
}
