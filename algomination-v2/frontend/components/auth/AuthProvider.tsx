"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  fetchMe,
  loginRequest,
  registerRequest,
} from "@/lib/api/auth";
import { tokenStore } from "@/lib/api/client";
import type { User } from "@/lib/api/types";

type Status = "loading" | "authed" | "guest";

interface AuthContextValue {
  user: User | null;
  status: Status;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  // Restore session on first load.
  useEffect(() => {
    let active = true;
    (async () => {
      if (!tokenStore.access) {
        if (active) setStatus("guest");
        return;
      }
      try {
        const me = await fetchMe();
        if (active) {
          setUser(me);
          setStatus("authed");
        }
      } catch {
        tokenStore.clear();
        if (active) setStatus("guest");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await loginRequest(email, password);
    const me = await fetchMe();
    setUser(me);
    setStatus("authed");
  }, []);

  const register = useCallback(
    async (email: string, name: string, password: string) => {
      const me = await registerRequest(email, name, password);
      setUser(me);
      setStatus("authed");
    },
    [],
  );

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setStatus("guest");
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
