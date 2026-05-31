"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Link2, Lock, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { InvitationsService } from "@/lib/services/InvitationsService";
import { normalizeApiError } from "@/lib/api/client";
import { useAuth } from "@/components/AuthContext";

type State = "idle" | "loading" | "success" | "error" | "no-token" | "unauthenticated";

export default function AcceptInvitePage() {
  return (
    <Suspense>
      <AcceptInviteContent />
    </Suspense>
  );
}

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const token = searchParams.get("token");

  const [state, setState]       = useState<State>("idle");
  const [boardId, setBoardId]   = useState<number | null>(null);
  const [boardName, setBoardName] = useState<string | null>(null);
  const [message, setMessage]   = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!token) { setState("no-token"); return; }
    if (!isAuthenticated) { setState("unauthenticated"); return; }

    const accept = async () => {
      setState("loading");
      try {
        const res = await InvitationsService.invitationsAccept({ token });
        setBoardId(res.board_id);
        setBoardName(res.board_name);
        setMessage(res.message);
        setState("success");
      } catch (err) {
        setMessage(normalizeApiError(err));
        setState("error");
      }
    };

    accept();
  }, [token, isAuthenticated, authLoading]);

  const btnPrimary = "rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600";
  const btnOutline = "rounded-xl border border-[var(--line)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-3)]";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md flex-col items-center justify-center px-6 py-16">
      <div className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-card">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-xl font-black text-white">
            FP
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink-3)]">FlowPilot</p>
        </div>

        {/* Loading */}
        {(state === "idle" || state === "loading" || authLoading) && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin text-brand-500" />
            <p className="text-sm font-semibold text-[var(--ink-2)]">Validation de l'invitation…</p>
          </div>
        )}

        {/* No token */}
        {state === "no-token" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-3)]">
              <Link2 size={28} className="text-[var(--ink-2)]" />
            </div>
            <h1 className="text-xl font-black text-[var(--ink)]">Lien invalide</h1>
            <p className="text-sm text-[var(--ink-2)]">
              Ce lien ne contient pas de jeton valide. Vérifiez l'URL ou demandez une nouvelle invitation.
            </p>
            <Link href="/" className={btnPrimary}>Accueil</Link>
          </div>
        )}

        {/* Unauthenticated */}
        {state === "unauthenticated" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-3)]">
              <Lock size={28} className="text-[var(--ink-2)]" />
            </div>
            <h1 className="text-xl font-black text-[var(--ink)]">Connexion requise</h1>
            <p className="text-sm text-[var(--ink-2)]">Vous devez être connecté pour accepter cette invitation.</p>
            <div className="flex gap-3">
              <Link href={`/login?next=/invite/accept?token=${token ?? ""}`} className={btnPrimary}>
                Se connecter
              </Link>
              <Link href={`/register?next=/invite/accept?token=${token ?? ""}`} className={btnOutline}>
                Créer un compte
              </Link>
            </div>
          </div>
        )}

        {/* Success */}
        {state === "success" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 size={32} className="text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-xl font-black text-[var(--ink)]">Invitation acceptée !</h1>
            {message && <p className="text-sm text-[var(--ink-2)]">{message}</p>}
            {boardName && (
              <p className="rounded-xl bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700 dark:bg-brand-700/20 dark:text-brand-300">
                Tableau : {boardName}
              </p>
            )}
            <div className="flex gap-3">
              {boardId && (
                <button onClick={() => router.push(`/board/${boardId}`)} className={btnPrimary}>
                  Ouvrir le tableau
                </button>
              )}
              <Link href="/spaces" className={btnOutline}>Mes tableaux</Link>
            </div>
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle size={28} className="text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-xl font-black text-[var(--ink)]">Erreur</h1>
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {message ?? "Une erreur est survenue lors de l'acceptation de l'invitation."}
            </p>
            <div className="flex gap-3">
              <Link href="/spaces" className={btnPrimary}>Mes tableaux</Link>
              <Link href="/" className={btnOutline}>Accueil</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
