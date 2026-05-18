"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Link2, Lock, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { InvitationsService } from "@/lib/services/InvitationsService";
import { normalizeApiError } from "@/lib/api/client";
import { useAuth } from "@/components/AuthContext";

type State = "idle" | "loading" | "success" | "error" | "no-token" | "unauthenticated";

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const token = searchParams.get("token");

  const [state, setState] = useState<State>("idle");
  const [boardId, setBoardId] = useState<number | null>(null);
  const [boardName, setBoardName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      setState("no-token");
      return;
    }
    if (!isAuthenticated) {
      setState("unauthenticated");
      return;
    }

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

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 py-16">
      <div className="w-full rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-xl font-black text-black">
            FP
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">FlowPilot</p>
        </div>

        {/* States */}
        {(state === "idle" || state === "loading" || authLoading) && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin text-yellow-400" />
            <p className="text-sm font-semibold text-gray-500">Validation de l'invitation…</p>
          </div>
        )}

        {state === "no-token" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Link2 size={28} className="text-gray-500" />
            </div>
            <h1 className="text-xl font-black text-black">Lien invalide</h1>
            <p className="text-sm text-gray-500">
              Ce lien d'invitation ne contient pas de jeton valide. Vérifiez l'URL ou demandez une nouvelle invitation.
            </p>
            <Link href="/" className="mt-2 rounded-xl bg-yellow-400 px-6 py-2.5 font-bold text-black hover:bg-orange-500">
              Accueil
            </Link>
          </div>
        )}

        {state === "unauthenticated" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Lock size={28} className="text-gray-500" />
            </div>
            <h1 className="text-xl font-black text-black">Connexion requise</h1>
            <p className="text-sm text-gray-500">
              Vous devez être connecté pour accepter une invitation.
            </p>
            <div className="flex gap-3">
              <Link
                href={`/login?next=/invite/accept${token ? `?token=${token}` : ""}`}
                className="rounded-xl bg-yellow-400 px-5 py-2.5 font-bold text-black hover:bg-orange-500"
              >
                Se connecter
              </Link>
              <Link
                href={`/register?next=/invite/accept${token ? `?token=${token}` : ""}`}
                className="rounded-xl border border-gray-300 px-5 py-2.5 font-bold text-black hover:bg-gray-100"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        )}

        {state === "success" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <h1 className="text-xl font-black text-black">Invitation acceptée !</h1>
            {message && <p className="text-sm text-gray-500">{message}</p>}
            {boardName && (
              <p className="rounded-xl bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700">
                Tableau : {boardName}
              </p>
            )}
            <div className="flex gap-3">
              {boardId && (
                <button
                  onClick={() => router.push(`/board/${boardId}`)}
                  className="rounded-xl bg-yellow-400 px-6 py-2.5 font-bold text-black hover:bg-orange-500"
                >
                  Ouvrir le tableau
                </button>
              )}
              <Link href="/spaces" className="rounded-xl border border-gray-300 px-5 py-2.5 font-bold text-black hover:bg-gray-100">
                Mes tableaux
              </Link>
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle size={28} className="text-red-600" />
            </div>
            <h1 className="text-xl font-black text-black">Erreur</h1>
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {message ?? "Une erreur est survenue lors de l'acceptation de l'invitation."}
            </p>
            <div className="flex gap-3">
              <Link href="/spaces" className="rounded-xl bg-yellow-400 px-5 py-2.5 font-bold text-black hover:bg-orange-500">
                Mes tableaux
              </Link>
              <Link href="/" className="rounded-xl border border-gray-300 px-5 py-2.5 font-bold text-black hover:bg-gray-100">
                Accueil
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
