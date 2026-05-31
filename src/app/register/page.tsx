"use client";

import { useState } from "react";
import Link from "next/link";
import { RegisterService } from "@/lib";
import { useRouter } from "next/navigation";
import { normalizeApiError, extractFieldErrors } from "@/lib/api/client";
import { useAuth } from "@/components/AuthContext";
import { uiImages } from "@/lib/ui-images";

const INPUT = "w-full rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] transition focus:border-brand-500 focus:outline-none";

export default function Register() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading]   = useState(false);
  const router = useRouter();
  const { loginWithUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});
    try {
      const res = await RegisterService.registerCreate({ username: name, email, password });
      loginWithUser(res.token, res.user);
      router.push("/spaces");
    } catch (err: unknown) {
      setError(normalizeApiError(err));
      setFieldErrors(extractFieldErrors(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--surface-2)] px-4 py-10">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-card md:grid-cols-2">
        {/* Left — form panel */}
        <div className="p-8 md:p-10">
          {/* Logo mobile */}
          <div className="mb-8 flex items-center gap-2 md:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-black text-white">FP</span>
            <span className="text-lg font-black tracking-tight text-[var(--ink)]">FLOWPILOT</span>
          </div>

          <header className="mb-8">
            <h2 className="text-2xl font-black text-[var(--ink)]">Créer un compte</h2>
            <p className="mt-1.5 text-sm text-[var(--ink-2)]">Rejoignez votre espace collaboratif.</p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]">Nom d'utilisateur</label>
              <input
                type="text"
                placeholder="votre_nom"
                value={name}
                onChange={e => setName(e.target.value)}
                className={INPUT}
                required
              />
              {fieldErrors.username?.map((msg, i) => (
                <p key={i} className="text-xs text-red-500">{msg}</p>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={INPUT}
                required
              />
              {fieldErrors.email?.map((msg, i) => (
                <p key={i} className="text-xs text-red-500">{msg}</p>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[var(--ink)]">Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={INPUT}
                required
              />
              {fieldErrors.password?.map((msg, i) => (
                <p key={i} className="text-xs text-red-500">{msg}</p>
              ))}
            </div>

            {error && (
              <div className="rounded-xl border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl bg-brand-500 py-3 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-50"
            >
              {loading ? "Création…" : "Créer un compte"}
            </button>

            <p className="text-center text-sm text-[var(--ink-2)]">
              Déjà un compte ?{" "}
              <Link href="/login" className="font-semibold text-brand-500 hover:text-brand-600 hover:underline">
                Se connecter
              </Link>
            </p>
          </form>
        </div>

        {/* Right — image panel */}
        <div className="relative hidden min-h-[420px] md:block">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${uiImages.authTeam})` }} />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex h-full flex-col justify-end p-10 text-white">
            <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-300">New workspace</p>
            <h3 className="text-4xl font-black uppercase leading-tight">Construisez votre système</h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
              Tableaux Kanban, listes, cartes, activités en temps réel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
