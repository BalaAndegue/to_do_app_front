"use client";

import { useEffect, useState } from "react";
import { Shield, X } from "lucide-react";

const STORAGE_KEY = "fp_cookie_consent";

type Prefs = { necessary: true; analytics: boolean; marketing: boolean };

export default function CookieConsent() {
  const [visible, setVisible]             = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [prefs, setPrefs]                 = useState<Prefs>({ necessary: true, analytics: false, marketing: false });

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const save = (p: Prefs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl">

        {!showCustomize ? (
          /* ── Bandeau principal ─────────────────────── */
          <div className="flex flex-wrap items-center gap-4 px-6 py-5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/20">
              <Shield size={20} className="text-brand-600 dark:text-brand-400" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-black text-[var(--ink)]">Nous utilisons des cookies</p>
              <p className="mt-0.5 text-sm text-[var(--ink-2)]">
                FlowPilot utilise des cookies essentiels et, avec votre accord, des cookies d'analyse pour améliorer votre expérience.{" "}
                <button
                  onClick={() => setShowCustomize(true)}
                  className="font-semibold text-brand-500 underline transition hover:text-brand-600"
                >
                  Personnaliser
                </button>
              </p>
            </div>

            <div className="flex flex-shrink-0 flex-wrap gap-2">
              <button
                onClick={() => save({ necessary: true, analytics: false, marketing: false })}
                className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm font-bold text-[var(--ink-2)] transition hover:bg-[var(--surface-3)]"
              >
                Refuser
              </button>
              <button
                onClick={() => setShowCustomize(true)}
                className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm font-bold text-[var(--ink-2)] transition hover:bg-[var(--surface-3)]"
              >
                Personnaliser
              </button>
              <button
                onClick={() => save({ necessary: true, analytics: true, marketing: true })}
                className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600"
              >
                Tout accepter
              </button>
            </div>
          </div>
        ) : (
          /* ── Panel personnalisation ───────────────── */
          <div className="px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-black text-[var(--ink)]">Préférences cookies</h3>
              <button onClick={() => setShowCustomize(false)} className="text-[var(--ink-3)] transition hover:text-[var(--ink)]">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <CookieRow
                title="Cookies essentiels"
                desc="Nécessaires au fonctionnement : authentification, session, sécurité. Non désactivables."
                checked={true} disabled onChange={() => {}}
              />
              <CookieRow
                title="Cookies d'analyse"
                desc="Nous aident à améliorer les performances et l'expérience utilisateur."
                checked={prefs.analytics}
                onChange={v => setPrefs(p => ({ ...p, analytics: v }))}
              />
              <CookieRow
                title="Cookies marketing"
                desc="Permettent de vous proposer des contenus et offres pertinents."
                checked={prefs.marketing}
                onChange={v => setPrefs(p => ({ ...p, marketing: v }))}
              />
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                onClick={() => save({ necessary: true, analytics: false, marketing: false })}
                className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm font-bold text-[var(--ink-2)] transition hover:bg-[var(--surface-3)]"
              >
                Tout refuser
              </button>
              <button
                onClick={() => save({ necessary: true, analytics: true, marketing: true })}
                className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm font-bold text-[var(--ink-2)] transition hover:bg-[var(--surface-3)]"
              >
                Tout accepter
              </button>
              <button
                onClick={() => save(prefs)}
                className="rounded-xl bg-brand-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-600"
              >
                Enregistrer mes choix
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CookieRow({
  title, desc, checked, disabled = false, onChange,
}: {
  title: string; desc: string; checked: boolean; disabled?: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface-3)] px-4 py-3">
      <div className="flex-1">
        <p className="text-sm font-bold text-[var(--ink)]">{title}</p>
        <p className="mt-0.5 text-xs text-[var(--ink-3)]">{desc}</p>
      </div>
      <button
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        role="switch"
        aria-checked={checked}
        className={`relative mt-0.5 inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-brand-500" : "bg-[var(--line-strong)]"
        } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
