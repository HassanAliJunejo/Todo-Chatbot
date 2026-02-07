"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Toast = { id: string; kind: "success" | "error"; message: string };

type ToastApi = {
  success: (message: string) => void;
  error: (message: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((kind: Toast["kind"], message: string) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, kind, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (m) => push("success", m),
      error: (m) => push("error", m),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

function ToastViewport({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed right-4 top-4 z-50 grid gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            t.kind === "success"
              ? "rounded-md bg-emerald-600 px-4 py-2 text-sm text-white shadow"
              : "rounded-md bg-red-600 px-4 py-2 text-sm text-white shadow"
          }
          role="status"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
