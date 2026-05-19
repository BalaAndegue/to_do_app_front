"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X } from "lucide-react";
import "./globals.css";
import { AuthProvider, useAuth } from "@/components/AuthContext";
import CookieConsent from "@/components/CookieConsent";
import Tooltip from "@/components/Tooltip";
import { ToastProvider } from "@/components/ToastContext";

/* ── Theme bootstrap (runs before first paint) ── */
const ThemeScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(){var t=localStorage.getItem('fp-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;if(d)document.documentElement.classList.add('dark');})();`,
    }}
  />
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900;1,14..32,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--surface-2)] text-[var(--ink)] antialiased transition-colors duration-200">
        <AuthProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
            <CookieConsent />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

/* ─────────────────────────────────────────────
   Nav links
───────────────────────────────────────────── */
const NAV_PUBLIC = [
  { href: "/", label: "Accueil" },
  { href: "/spaces", label: "Tableaux" },
  { href: "/login", label: "Connexion" },
  { href: "/register", label: "Inscription" },
];
const NAV_AUTH = [
  { href: "/", label: "Accueil" },
  { href: "/spaces", label: "Mes tableaux" },
  { href: "/activities", label: "Activites" },
];

/* ─────────────────────────────────────────────
   AppShell
───────────────────────────────────────────── */
function AppShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("fp-theme", next ? "dark" : "light");
  };

  const navLinks = mounted && isAuthenticated ? NAV_AUTH : NAV_PUBLIC;
  const initials = user?.username?.substring(0, 2).toUpperCase() ?? "U";

  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--surface)]/95 shadow-sm backdrop-blur-md transition-colors duration-200">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight text-[var(--ink)]">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-black text-white shadow-sm">
              FP
            </span>
            <span className="hidden sm:inline">FLOWPILOT</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface-3)] px-1 py-1 transition-colors duration-200">
            {navLinks.map(link => {
              const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-150 ${
                    active
                      ? "bg-brand-500 text-white shadow-sm"
                      : "text-[var(--ink-2)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Tooltip label={dark ? "Mode clair" : "Mode sombre"}>
              <button
                onClick={toggleTheme}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-3)] text-[var(--ink-2)] transition hover:border-brand-500 hover:text-brand-500"
              >
                {dark ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </Tooltip>

            {mounted && isAuthenticated ? (
              <>
                <Tooltip label="Mon profil">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-sm font-semibold text-[var(--ink)] transition hover:border-brand-500 hover:shadow-sm"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-xs font-black text-white">
                      {initials}
                    </span>
                    <span className="hidden sm:inline">{user?.username ?? "Profil"}</span>
                  </Link>
                </Tooltip>
                <Tooltip label="Se deconnecter">
                  <button
                    onClick={logout}
                    className="rounded-full border border-[var(--line)] bg-[var(--ink)] px-4 py-1.5 text-sm font-bold text-[var(--surface)] transition hover:opacity-80"
                  >
                    Deconnexion
                  </button>
                </Tooltip>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block rounded-full border border-[var(--line)] px-4 py-1.5 text-sm font-semibold text-[var(--ink)] hover:bg-[var(--surface-3)] transition"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-brand-500 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-brand-600 hover:shadow-md"
                >
                  Commencer
                </Link>
              </>
            )}

            {/* Burger */}
            <button
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--line)] text-[var(--ink-2)] transition hover:bg-[var(--surface-3)]"
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="border-t border-[var(--line)] bg-[var(--surface)] px-4 py-3 md:hidden animate-fade-in">
            <nav className="flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-brand-50 dark:hover:bg-brand-700/20 transition"
                >
                  {link.label}
                </Link>
              ))}
              {mounted && isAuthenticated && (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="mt-2 rounded-xl px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  Deconnexion
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* ── Page content ──────────────────────────────────── */}
      <main className="flex-1 w-full">{children}</main>

      {/* ── Footer — home only ────────────────────────────── */}
      {pathname === "/" && <footer className="border-t border-[var(--line)] bg-[#0B0F1A] text-white transition-colors duration-200">
        <div className="mx-auto w-full max-w-7xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 font-black text-white shadow-sm">FP</span>
                <span className="text-xl font-black tracking-tight">FLOWPILOT</span>
              </div>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                La plateforme collaborative pour piloter vos projets — tableaux Kanban, listes, cartes, activites en temps reel.
              </p>
              <div className="mt-5 flex gap-3">
                {["G", "T", "L"].map(l => (
                  <button
                    key={l}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs text-slate-400 transition hover:border-brand-500 hover:text-brand-400"
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <FooterCol title="Navigation" links={[
              { label: "Accueil", href: "/" },
              { label: "Mes tableaux", href: "/spaces" },
              { label: "Activites", href: "/activities" },
              { label: "Mon profil", href: "/profile" },
            ]} />

            <FooterCol title="Produit" links={[
              { label: "Tableaux Kanban", href: "/spaces" },
              { label: "Listes et cartes", href: "/spaces" },
              { label: "Checklists", href: "/spaces" },
              { label: "Labels et membres", href: "/spaces" },
            ]} />

            <div>
              <h5 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">Contact</h5>
              <ul className="flex flex-col gap-3 text-sm text-slate-400">
                <li>support@flowpilot.app</li>
                <li>+237 6XX XX XX XX</li>
                <li>Yaounde, Cameroun</li>
              </ul>
              <div className="mt-6 rounded-xl bg-white/5 p-4 border border-white/10">
                <p className="text-xs font-bold text-brand-400">API Status</p>
                <p className="mt-1 text-xs text-slate-400">flowpilot-api.duckdns.org — REST v1</p>
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-bold text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse-soft" />
                  En ligne
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} FlowPilot — Tous droits reserves.</p>
            <div className="flex gap-5">
              <span className="cursor-pointer hover:text-white transition">Confidentialite</span>
              <span className="cursor-pointer hover:text-white transition">Conditions d&apos;utilisation</span>
              <span className="cursor-pointer hover:text-white transition">Licence MIT</span>
            </div>
          </div>
        </div>
      </footer>}
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h5 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">{title}</h5>
      <ul className="flex flex-col gap-3">
        {links.map(l => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm text-slate-400 transition hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
