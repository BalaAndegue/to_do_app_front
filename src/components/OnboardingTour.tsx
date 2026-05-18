"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Rocket, LayoutList, Columns3, CreditCard, Users,
  Tag, TrendingUp, CheckCircle2, Map,
  ChevronLeft, ChevronRight, X, Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const STORAGE_KEY = "fp_onboarding_done";

type Step = {
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  tip: string | null;
  action: { label: string; href: string } | null;
};

const STEPS: Step[] = [
  {
    Icon: Rocket,
    iconBg: "bg-brand-100 dark:bg-brand-900/30",
    iconColor: "text-brand-600 dark:text-brand-400",
    title: "Bienvenue sur FlowPilot",
    desc: "FlowPilot est votre plateforme Kanban collaborative. Organisez vos projets, assignez des tâches et suivez l'avancement — tout au même endroit.",
    tip: null,
    action: null,
  },
  {
    Icon: LayoutList,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    title: "Créez votre premier tableau",
    desc: 'Un tableau représente un projet. Cliquez sur "Nouveau tableau", choisissez un nom et une visibilité (privé, workspace ou public).',
    tip: "Astuce : utilisez un fond coloré pour distinguer vos projets d'un coup d'œil.",
    action: { label: "Aller à mes tableaux", href: "/spaces" },
  },
  {
    Icon: Columns3,
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    title: "Organisez vos listes",
    desc: 'Créez des colonnes pour vos étapes : "Backlog", "En cours", "En revue", "Terminé". Cliquez sur le titre d\'une liste pour la renommer.',
    tip: "Astuce : limitez à 5–7 listes pour rester lisible.",
    action: null,
  },
  {
    Icon: CreditCard,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    title: "Ajoutez des cartes",
    desc: "Chaque carte est une tâche. Cliquez dessus pour l'enrichir : description, dates, labels, membres, checklists et pièces jointes.",
    tip: "Astuce : la barre de progression de la checklist se met à jour en temps réel.",
    action: null,
  },
  {
    Icon: Users,
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    title: "Invitez votre équipe",
    desc: 'Sur la page d\'un tableau, cliquez sur "Inviter" et entrez l\'e-mail de votre collaborateur. Choisissez son rôle : Membre ou Observateur.',
    tip: "Astuce : les invitations expirent — relancez si votre collègue n'a pas reçu le mail.",
    action: null,
  },
  {
    Icon: Tag,
    iconBg: "bg-pink-100 dark:bg-pink-900/30",
    iconColor: "text-pink-600 dark:text-pink-400",
    title: "Utilisez les labels",
    desc: 'Créez des labels colorés ("Urgent", "Bug", "Feature") et appliquez-les à vos cartes pour identifier les priorités en un coup d\'œil.',
    tip: null,
    action: null,
  },
  {
    Icon: TrendingUp,
    iconBg: "bg-teal-100 dark:bg-teal-900/30",
    iconColor: "text-teal-600 dark:text-teal-400",
    title: "Suivez les activités",
    desc: 'La page "Activités" enregistre toutes les actions sur vos tableaux. Filtrez par tableau ou par carte pour retrouver n\'importe quel événement.',
    tip: "Astuce : consultez les activités pour rester à jour sans relances.",
    action: { label: "Voir les activités", href: "/activities" },
  },
  {
    Icon: CheckCircle2,
    iconBg: "bg-brand-100 dark:bg-brand-900/30",
    iconColor: "text-brand-600 dark:text-brand-400",
    title: "Vous êtes prêt !",
    desc: "Vous connaissez l'essentiel de FlowPilot. Lancez votre premier tableau et commencez à piloter vos projets.",
    tip: null,
    action: { label: "Démarrer maintenant", href: "/spaces" },
  },
];

export default function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  const openTour = () => { setStep(0); setOpen(true); };
  const close    = () => setOpen(false);
  const finish   = () => { localStorage.setItem(STORAGE_KEY, "1"); setDone(true); setOpen(false); };

  const current  = STEPS[step];
  const { Icon } = current;
  const isLast   = step === STEPS.length - 1;
  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <>
      {/* ── Bouton déclencheur ─────────────────────────────── */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={openTour}
          className="flex items-center gap-3 rounded-2xl bg-brand-500 px-8 py-4 text-lg font-black text-white shadow-glow transition hover:bg-brand-600 active:scale-95"
        >
          <Map size={22} />
          {done ? "Relancer la visite guidée" : "Découvrir FlowPilot"}
        </button>
        {done && (
          <p className="text-xs text-[var(--ink-3)]">Vous avez déjà complété la visite.</p>
        )}
      </div>

      {/* ── Dialog ─────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) close(); }}
        >
          <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-3)] px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-black text-white">FP</span>
                <span className="text-sm font-bold text-brand-500">Visite guidée</span>
              </div>
              <button onClick={close} className="text-[var(--ink-3)] transition hover:text-[var(--ink)]">
                <X size={20} />
              </button>
            </div>

            {/* Barre de progression */}
            <div className="h-1 w-full bg-[var(--line)]">
              <div className="h-1 bg-brand-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>

            {/* Dots */}
            <div className="flex items-center gap-1 px-6 pt-5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step ? "w-6 bg-brand-500" : i < step ? "w-3 bg-brand-300" : "w-3 bg-[var(--line-strong)]"
                  }`}
                />
              ))}
              <span className="ml-auto text-xs font-semibold text-[var(--ink-3)]">
                {step + 1} / {STEPS.length}
              </span>
            </div>

            {/* Contenu */}
            <div className="flex flex-col gap-4 px-6 py-6">
              <div className="flex items-center gap-4">
                <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${current.iconBg}`}>
                  <Icon size={28} className={current.iconColor} />
                </div>
                <h2 className="text-2xl font-black leading-tight text-[var(--ink)]">{current.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-[var(--ink-2)]">{current.desc}</p>
              {current.tip && (
                <div className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:border-brand-700/40 dark:bg-brand-900/20 dark:text-brand-300">
                  {current.tip}
                </div>
              )}
              {current.action && (
                <Link
                  href={current.action.href}
                  onClick={close}
                  className="self-start rounded-xl border border-[var(--line)] bg-[var(--surface-3)] px-5 py-2.5 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--line)] hover:text-brand-500"
                >
                  {current.action.label} →
                </Link>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between border-t border-[var(--line)] px-6 py-4">
              <button
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                className="flex items-center gap-1.5 rounded-xl border border-[var(--line)] px-4 py-2 text-sm font-bold text-[var(--ink-2)] transition hover:bg-[var(--surface-3)] disabled:opacity-30"
              >
                <ChevronLeft size={16} /> Précédent
              </button>

              <button
                onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
                className="text-sm font-bold text-[var(--ink-3)] transition hover:text-[var(--ink)]"
              >
                Passer
              </button>

              {isLast ? (
                <button
                  onClick={finish}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-6 py-2 text-sm font-bold text-white transition hover:bg-brand-600"
                >
                  Terminer <Check size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-6 py-2 text-sm font-bold text-white transition hover:bg-brand-600"
                >
                  Suivant <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
