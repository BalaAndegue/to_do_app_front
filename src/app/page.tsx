"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, type ReactNode } from "react";
import {
  LayoutList, CreditCard, CheckSquare, Tag,
  Users, MessageCircle, Paperclip, TrendingUp,
  ArrowRight, type LucideIcon,
} from "lucide-react";
import OnboardingTour from "@/components/OnboardingTour";
import { uiImages } from "@/lib/ui-images";

/* ── Scroll reveal ─────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".sr, .sr-left");
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function SR({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <div className={`sr sr-delay-${delay} ${className}`}>
      {children}
    </div>
  );
}

function MiniCard({ title, color, active, done }: { title: string; color: string; active?: boolean; done?: boolean }) {
  return (
    <div className={`rounded-lg border bg-[var(--surface-2)] px-2 py-1.5 ${active ? "border-brand-300 dark:border-brand-700" : "border-[var(--line)]"}`}>
      <div className="mb-1 h-1 w-8 rounded-full" style={{ backgroundColor: color }} />
      <p className={`text-[10px] font-medium leading-tight ${done ? "text-[var(--ink-3)] line-through" : "text-[var(--ink)]"}`}>{title}</p>
    </div>
  );
}

/* ── Marketplace data ──────────────────────────────────── */
type MItem = { Icon: LucideIcon; title: string; desc: string; tag: string; href: string; accent: string; iconCls: string };

const MARKET: MItem[] = [
  { Icon: LayoutList,    title: "Tableaux Kanban",   desc: "Espaces visuels, fond personnalise, partage instantane avec l'equipe.",          tag: "Core",          href: "/spaces",     accent: "border-brand-400 bg-brand-50 dark:bg-brand-700/10",   iconCls: "text-brand-500" },
  { Icon: CreditCard,    title: "Cartes & Taches",   desc: "Taches completes : description, dates, labels, membres, checklist.",              tag: "Core",          href: "/spaces",     accent: "border-blue-300 bg-blue-50 dark:bg-blue-900/20",        iconCls: "text-blue-600 dark:text-blue-400" },
  { Icon: CheckSquare,   title: "Checklists",         desc: "Sous-etapes avec barre de progression. Cochez au fur et a mesure.",              tag: "Productivite",  href: "/spaces",     accent: "border-green-300 bg-green-50 dark:bg-green-900/20",     iconCls: "text-green-600 dark:text-green-400" },
  { Icon: Tag,           title: "Labels & Priorites", desc: "Etiquettes colorees par tableau. Tri et filtrage instantane.",                   tag: "Organisation",  href: "/spaces",     accent: "border-purple-300 bg-purple-50 dark:bg-purple-900/20",  iconCls: "text-purple-600 dark:text-purple-400" },
  { Icon: Users,         title: "Gestion d'equipe",  desc: "Invitez par e-mail. Roles Admin, Membre ou Observateur par tableau.",             tag: "Collaboration", href: "/spaces",     accent: "border-orange-300 bg-orange-50 dark:bg-orange-900/20",  iconCls: "text-orange-600 dark:text-orange-400" },
  { Icon: MessageCircle, title: "Commentaires",       desc: "Discussion directe sur les cartes. Historique complet par tache.",               tag: "Communication", href: "/spaces",     accent: "border-pink-300 bg-pink-50 dark:bg-pink-900/20",        iconCls: "text-pink-600 dark:text-pink-400" },
  { Icon: Paperclip,     title: "Pieces jointes",     desc: "Fichiers et liens attaches aux cartes. Acces direct depuis la tache.",           tag: "Fichiers",      href: "/spaces",     accent: "border-slate-300 bg-slate-50 dark:bg-slate-800/40",     iconCls: "text-slate-600 dark:text-slate-400" },
  { Icon: TrendingUp,    title: "Journal d'activites",desc: "Toutes les actions en temps reel. Filtrage par tableau ou par carte.",           tag: "Suivi",         href: "/activities", accent: "border-teal-300 bg-teal-50 dark:bg-teal-900/20",        iconCls: "text-teal-600 dark:text-teal-400" },
];

/* ─────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────── */
export default function Home() {
  useScrollReveal();

  return (
    <div className="w-full text-[var(--ink)]">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-[var(--line)] bg-[var(--surface)]">
        {/* background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(var(--ink) 1px,transparent 1px),linear-gradient(90deg,var(--ink) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:py-24 lg:gap-20">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <SR delay={1}>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600 dark:border-brand-700 dark:bg-brand-700/20 dark:text-brand-400">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse-soft" />
                Kanban collaboratif
              </span>
            </SR>
            <SR delay={2}>
              <h1 className="mt-4 text-5xl font-black uppercase leading-[0.92] tracking-tight text-[var(--ink)] md:text-6xl lg:text-7xl">
                Pilotez
                <br />
                vos projets
                <br />
                <span className="text-brand-500">en un clic.</span>
              </h1>
            </SR>
            <SR delay={3}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--ink-2)]">
                Creez des espaces, organisez vos tableaux et faites avancer vos cartes avec un flux moderne et collaboratif.
              </p>
            </SR>
            <SR delay={4}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/spaces"
                  className="inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-600 hover:shadow-lg active:scale-95"
                >
                  Explorer les tableaux <ArrowRight size={16} />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)] px-6 py-3 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--surface-3)] hover:shadow-sm"
                >
                  Creer un compte
                </Link>
              </div>
            </SR>
          </div>

          {/* Right — Kanban board mockup */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-full max-w-[460px] rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-3 shadow-card-lg">

              {/* Board header */}
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse-soft" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--ink-2)]">Sprint Produit Q2</span>
                </div>
                <div className="flex -space-x-1.5">
                  {["A","B","C"].map(l => (
                    <div key={l} className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-[9px] font-black text-white ring-2 ring-[var(--surface-2)]">{l}</div>
                  ))}
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface-3)] text-[9px] font-bold text-[var(--ink-3)] ring-2 ring-[var(--surface-2)]">+5</div>
                </div>
              </div>

              {/* Columns */}
              <div className="grid grid-cols-3 gap-2">
                {/* À faire */}
                <div className="flex flex-col gap-1.5 rounded-xl bg-[var(--surface)] p-2">
                  <p className="px-1 text-[10px] font-bold uppercase tracking-wide text-[var(--ink-3)]">À faire <span className="ml-0.5 text-[var(--ink-3)]">3</span></p>
                  <MiniCard title="Auth OAuth" color="#8b5cf6" />
                  <MiniCard title="Dashboard v2" color="#3b82f6" />
                  <MiniCard title="Export PDF" color="#f59e0b" />
                </div>

                {/* En cours */}
                <div className="flex flex-col gap-1.5 rounded-xl bg-[var(--surface)] p-2">
                  <p className="px-1 text-[10px] font-bold uppercase tracking-wide text-brand-600 dark:text-brand-400">En cours <span>2</span></p>
                  <MiniCard title="API Rest v3" color="#10b981" active />
                  <MiniCard title="Notifications" color="#ec4899" active />
                </div>

                {/* Terminé */}
                <div className="flex flex-col gap-1.5 rounded-xl bg-[var(--surface)] p-2">
                  <p className="px-1 text-[10px] font-bold uppercase tracking-wide text-green-600 dark:text-green-400">Terminé <span>4</span></p>
                  <MiniCard title="Setup CI/CD" color="#10b981" done />
                  <MiniCard title="Design system" color="#8b5cf6" done />
                  <MiniCard title="Auth JWT" color="#3b82f6" done />
                </div>
              </div>

              {/* Bottom bar */}
              <div className="mt-3 flex items-center justify-between rounded-xl bg-[var(--surface)] px-3 py-2">
                <span className="text-[10px] text-[var(--ink-3)]">4 cartes terminées ce sprint</span>
                <span className="text-[10px] font-bold text-green-500">↑ 12%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ ONBOARDING ════════════════════════════════════════ */}
      <section className="border-b border-[var(--line)] bg-[var(--surface-2)] px-6 py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center">
          <SR>
            <span className="inline-block rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-1 text-xs font-bold uppercase tracking-widest text-[var(--ink-2)]">
              Guide interactif
            </span>
          </SR>
          <SR delay={1}>
            <h2 className="text-4xl font-black uppercase leading-none tracking-tight text-[var(--ink)]">
              Nouveau ici ?
            </h2>
          </SR>
          <SR delay={2}>
            <p className="max-w-lg text-[var(--ink-2)]">
              Suivez notre visite guidee interactive pour maitriser FlowPilot en moins de 3 minutes.
            </p>
          </SR>
          <SR delay={3}>
            <OnboardingTour />
          </SR>
        </div>
      </section>

      {/* ══ MARKETPLACE ═══════════════════════════════════════ */}
      <section className="border-b border-[var(--line)] bg-[var(--surface)] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="sr">
              <span className="inline-block rounded-full border border-[var(--line)] bg-[var(--surface-3)] px-4 py-1 text-xs font-bold uppercase tracking-widest text-[var(--ink-3)]">
                Services
              </span>
              <h2 className="mt-3 text-4xl font-black uppercase leading-none tracking-tight text-[var(--ink)]">
                Marketplace
              </h2>
              <p className="mt-3 max-w-lg text-[var(--ink-2)]">
                Tous les modules disponibles des maintenant. Cliquez pour acceder directement.
              </p>
            </div>
            <Link
              href="/spaces"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-6 py-2.5 text-sm font-bold text-[var(--surface)] transition hover:opacity-80"
            >
              Ouvrir mes tableaux <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MARKET.map((item, i) => (
              <div key={item.title} className={`sr sr-delay-${Math.min(i % 4 + 1, 4)}`}>
                <Link
                  href={item.href}
                  className={`card-lift group flex h-full flex-col gap-3 rounded-2xl border p-5 ${item.accent} transition`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 dark:bg-black/20 shadow-sm">
                      <item.Icon size={20} className={item.iconCls} />
                    </div>
                    <span className="rounded-full bg-white/70 dark:bg-black/30 px-2.5 py-0.5 text-xs font-bold text-[var(--ink-2)]">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-[var(--ink)]">{item.title}</h3>
                  <p className="flex-1 text-xs leading-relaxed text-[var(--ink-2)]">{item.desc}</p>
                  <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[var(--ink-3)] transition group-hover:text-brand-500 group-hover:gap-2">
                    Acceder <ArrowRight size={11} />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA SPLIT ═════════════════════════════════════════ */}
      <section className="bg-[var(--surface-2)] px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          {/* Left — dark card */}
          <div
            className="animated-media-frame sr overflow-hidden rounded-[32px] p-8 text-white shadow-card-lg"
            style={
              {
                "--frame-image": `url(${uiImages.spaceCard2})`,
                "--frame-overlay": "linear-gradient(145deg,rgba(11,15,26,.92) 0%,rgba(11,15,26,.78) 55%,rgba(245,158,11,.45) 160%)",
              } as CSSProperties
            }
          >
            <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-between">
              <div>
                <span className="inline-block rounded-full border border-brand-400/40 bg-brand-500/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-300">
                  Commencez
                </span>
                <h3 className="mt-4 text-3xl font-black uppercase leading-tight">
                  Lancez
                  <br />
                  votre projet
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Creez votre premier tableau en moins d'une minute et invitez votre equipe a collaborer.
                </p>
              </div>
              <Link
                href="/spaces"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-2xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 hover:shadow-lg"
              >
                Creer mon espace <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Right — feature grid */}
          <div className="sr sr-delay-2 relative overflow-hidden rounded-[32px] border border-[var(--line)] bg-[var(--surface)] shadow-card">
            {/* Decorative rotated image */}
            <div
              className="absolute -right-6 -top-6 h-[55%] w-[55%] rotate-12 overflow-hidden rounded-[24px] opacity-60"
              style={{
                backgroundImage: `linear-gradient(rgba(15,23,42,.3),rgba(15,23,42,.3)),url(${uiImages.heroWorkspace})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              className="animated-media-frame relative z-10 h-full min-h-[260px] rounded-[32px] p-8"
              style={
                {
                  "--frame-image": `url(${uiImages.spaceCard1})`,
                  "--frame-overlay": "linear-gradient(135deg,rgba(209,250,229,.6) 0%,rgba(191,219,254,.6) 100%)",
                } as CSSProperties
              }
            >
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
                  Carte strategique
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm font-semibold">
                  {["Produit", "Engineering", "Marketing", "Operations"].map(t => (
                    <div key={t} className="rounded-xl bg-white/80 dark:bg-black/30 p-3 text-slate-800 dark:text-slate-100 backdrop-blur-sm">
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
