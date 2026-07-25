"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getStoredUser, isAdminUser } from "@/lib/api";

type EditModeContextValue = {
  isAdmin: boolean;
  editMode: boolean;
  setEditMode: (on: boolean) => void;
  toggleEditMode: () => void;
  refreshKey: number;
  bumpRefresh: () => void;
  leadsOpen: boolean;
  setLeadsOpen: (open: boolean) => void;
  user: any | null;
  refreshAuth: () => void;
};

const EditModeContext = createContext<EditModeContextValue | null>(null);

const EDIT_MODE_KEY = "sca_edit_mode";

export function EditModeProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [editMode, setEditModeState] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [leadsOpen, setLeadsOpen] = useState(false);

  const refreshAuth = useCallback(() => {
    const next = getStoredUser();
    setUser(next);
    if (!isAdminUser(next)) {
      setEditModeState(false);
      setLeadsOpen(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
    const onAuth = () => refreshAuth();
    window.addEventListener("auth-changed", onAuth);
    window.addEventListener("storage", onAuth);
    return () => {
      window.removeEventListener("auth-changed", onAuth);
      window.removeEventListener("storage", onAuth);
    };
  }, [refreshAuth]);

  useEffect(() => {
    if (!isAdminUser(user)) return;
    try {
      const saved = sessionStorage.getItem(EDIT_MODE_KEY);
      if (saved === "1") setEditModeState(true);
    } catch {
      /* ignore */
    }
  }, [user]);

  const setEditMode = useCallback(
    (on: boolean) => {
      if (!isAdminUser(user)) {
        setEditModeState(false);
        return;
      }
      setEditModeState(on);
      try {
        sessionStorage.setItem(EDIT_MODE_KEY, on ? "1" : "0");
      } catch {
        /* ignore */
      }
    },
    [user]
  );

  const toggleEditMode = useCallback(() => {
    setEditMode(!editMode);
  }, [editMode, setEditMode]);

  const bumpRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const isAdmin = isAdminUser(user);

  const value = useMemo(
    () => ({
      isAdmin,
      editMode: isAdmin && editMode,
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
      isAdmin,
      editMode,
      setEditMode,
      toggleEditMode,
      refreshKey,
      bumpRefresh,
      leadsOpen,
      user,
      refreshAuth,
    ]
  );

  return (
    <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>
  );
}

export function useEditMode() {
  const ctx = useContext(EditModeContext);
  if (!ctx) {
    throw new Error("useEditMode must be used within EditModeProvider");
  }
  return ctx;
}

/** Safe hook when provider might be missing (returns disabled defaults). */
export function useEditModeOptional(): EditModeContextValue {
  const ctx = useContext(EditModeContext);
  return (
    ctx || {
      isAdmin: false,
      editMode: false,
      setEditMode: () => {},
      toggleEditMode: () => {},
      refreshKey: 0,
      bumpRefresh: () => {},
      leadsOpen: false,
      setLeadsOpen: () => {},
      user: null,
      refreshAuth: () => {},
    }
  );
}
