import { useCallback, useSyncExternalStore } from "react";
import { getApiKey, setApiKey, clearApiKey } from "../api/client";

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function notify() {
  listeners.forEach((cb) => cb());
}

function getSnapshot(): boolean {
  return getApiKey() !== null;
}

export function useAuth() {
  const isAuthenticated = useSyncExternalStore(subscribe, getSnapshot);

  const login = useCallback((key: string) => {
    setApiKey(key);
    notify();
  }, []);

  const logout = useCallback(() => {
    clearApiKey();
    notify();
  }, []);

  return { isAuthenticated, login, logout };
}
