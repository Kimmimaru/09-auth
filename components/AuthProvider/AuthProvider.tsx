"use client";

import { useEffect, type ReactNode } from "react";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const hasSession = await checkSession();

        if (!hasSession) {
          if (isMounted) {
            clearIsAuthenticated();
          }
          return;
        }

        const currentUser = await getMe();

        if (isMounted) {
          setUser(currentUser);
        }
      } catch {
        if (isMounted) {
          clearIsAuthenticated();
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [clearIsAuthenticated, setUser]);

  return children;
}
