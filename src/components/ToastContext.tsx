"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastMsg { id: number; message: string; type: ToastType }
interface ToastCtx  { toast: (message: string, type?: ToastType) => void }

const Ctx = createContext<ToastCtx>({ toast: () => {} });
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const counter = useRef(0);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++counter.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  }, []);

  const dismiss = useCallback((id: number) =>
    setToasts(prev => prev.filter(t => t.id !== id)), []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div
        className="fixed bottom-6 right-6 z-[300] flex flex-col gap-3 pointer-events-none"
        aria-live="polite"
      >
        {toasts.map(t => <Toast key={t.id} t={t} onClose={() => dismiss(t.id)} />)}
      </div>
    </Ctx.Provider>
  );
}

const CONFIG: Record<ToastType, { cls: string; Icon: React.ElementType }> = {
  success: { cls: "bg-green-500 border-green-400", Icon: CheckCircle2 },
  error:   { cls: "bg-red-500   border-red-400",   Icon: XCircle },
  info:    { cls: "bg-blue-500  border-blue-400",  Icon: Info },
};

function Toast({ t, onClose }: { t: ToastMsg; onClose: () => void }) {
  const { cls, Icon } = CONFIG[t.type];
  return (
    <div
      className={`pointer-events-auto flex min-w-72 max-w-sm items-start gap-3 rounded-2xl border ${cls} px-4 py-3 text-sm font-semibold text-white shadow-2xl animate-fade-up`}
    >
      <Icon size={18} className="mt-0.5 flex-shrink-0" />
      <span className="flex-1 leading-snug">{t.message}</span>
      <button
        onClick={onClose}
        className="flex-shrink-0 rounded-full p-0.5 text-white/70 transition hover:bg-white/25 hover:text-white"
      >
        <X size={14} />
      </button>
    </div>
  );
}
