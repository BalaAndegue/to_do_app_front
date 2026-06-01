"use client";

import { useEffect, useState } from "react";
import { Shield, FileText, X, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "fp_policy_v1";

type Tab = "privacy" | "terms";

export default function PolicyConsent() {
  const [visible, setVisible] = useState(false);
  const [tab, setTab]         = useState<Tab>("privacy");
  const [refused, setRefused] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted: true, date: new Date().toISOString() }));
    setVisible(false);
  };

  const refuse = () => {
    setRefused(true);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl">

        {/* ── Header ─────────────────────────────────── */}
        <div className="flex items-center gap-3 border-b border-[var(--line)] px-6 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/20">
            <Shield size={20} className="text-brand-600 dark:text-brand-400" />
          </div>
          <div className="flex-1">
            <h2 className="font-black text-[var(--ink)]">Politique de confidentialité & CGU</h2>
            <p className="text-xs text-[var(--ink-2)]">Veuillez lire et accepter nos conditions avant de continuer.</p>
          </div>
        </div>

        {refused ? (
          /* ── Vue refus ─────────────────────────────── */
          <div className="flex flex-col items-center gap-4 px-6 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
              <X size={28} className="text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-black text-[var(--ink)]">Accès limité</h3>
            <p className="max-w-md text-sm text-[var(--ink-2)]">
              L'acceptation de nos politiques est requise pour utiliser FlowPilot. Sans votre accord,
              vous ne pouvez pas créer de compte ni accéder aux fonctionnalités de la plateforme.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setRefused(false)}
                className="rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
              >
                Relire et accepter
              </button>
              <button
                onClick={() => setVisible(false)}
                className="rounded-xl border border-[var(--line)] px-5 py-2.5 text-sm font-semibold text-[var(--ink-2)] transition hover:bg-[var(--surface-3)]"
              >
                Fermer (accès limité)
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ── Onglets ─────────────────────────────── */}
            <div className="flex border-b border-[var(--line)]">
              {(["privacy", "terms"] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex flex-1 items-center justify-center gap-2 px-5 py-3 text-sm font-semibold transition ${
                    tab === t
                      ? "border-b-2 border-brand-500 text-brand-500"
                      : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                  }`}
                >
                  {t === "privacy" ? <Shield size={14} /> : <FileText size={14} />}
                  {t === "privacy" ? "Confidentialité" : "Conditions d'utilisation"}
                </button>
              ))}
            </div>

            {/* ── Contenu scrollable ──────────────────── */}
            <div className="h-64 overflow-y-auto px-6 py-4 text-sm text-[var(--ink-2)] leading-relaxed">
              {tab === "privacy" ? <PrivacyContent /> : <TermsContent />}
            </div>

            {/* ── Actions ─────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] px-6 py-4">
              <p className="text-xs text-[var(--ink-3)]">
                En acceptant, vous confirmez avoir lu nos{" "}
                <Link href="/privacy" className="text-brand-500 underline hover:text-brand-600" target="_blank">
                  politiques de confidentialité
                </Link>{" "}
                et nos{" "}
                <Link href="/terms" className="text-brand-500 underline hover:text-brand-600" target="_blank">
                  CGU
                </Link>.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={refuse}
                  className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm font-bold text-[var(--ink-2)] transition hover:bg-[var(--surface-3)]"
                >
                  Refuser
                </button>
                <button
                  onClick={accept}
                  className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-600"
                >
                  <CheckCircle2 size={15} />
                  Accepter et continuer
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Textes des politiques ─────────────────────────────────── */
function PrivacyContent() {
  return (
    <div className="flex flex-col gap-4">
      <Section title="1. Données collectées">
        Nous collectons les informations que vous fournissez lors de l'inscription (nom, email) et les données générées
        lors de l'utilisation de la plateforme (tableaux, cartes, activités). Nous ne collectons aucune donnée
        sensible et ne vendons jamais vos données à des tiers.
      </Section>
      <Section title="2. Utilisation des données">
        Vos données sont utilisées exclusivement pour faire fonctionner FlowPilot : affichage de vos tableaux,
        collaboration avec votre équipe, envoi de notifications liées à votre activité. Aucune utilisation
        publicitaire ou commerciale de vos données personnelles.
      </Section>
      <Section title="3. Cookies">
        FlowPilot utilise des cookies essentiels au fonctionnement (authentification, session) et,
        avec votre accord, des cookies d'analyse pour améliorer l'expérience. Vous pouvez gérer
        vos préférences via le bandeau cookies présent sur le site.
      </Section>
      <Section title="4. Stockage et sécurité">
        Vos données sont stockées sur des serveurs sécurisés. Nous appliquons le chiffrement en transit (HTTPS)
        et au repos. La durée de conservation est limitée à la durée de votre compte actif.
      </Section>
      <Section title="5. Vos droits">
        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et
        de portabilité de vos données. Pour toute demande, contactez-nous à{" "}
        <span className="font-semibold">support@flowpilot.app</span>.
      </Section>
      <Section title="6. Contact">
        FlowPilot — Yaoundé, Cameroun. Email : balaandeguefrancoislionnel@gmail.com
      </Section>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="flex flex-col gap-4">
      <Section title="1. Acceptation des conditions">
        En utilisant FlowPilot, vous acceptez les présentes Conditions Générales d'Utilisation.
        Si vous n'acceptez pas ces conditions, vous ne pouvez pas utiliser la plateforme.
      </Section>
      <Section title="2. Utilisation autorisée">
        FlowPilot est destiné à la gestion de projets professionnels et personnels. Toute utilisation
        abusive, illégale ou portant atteinte aux droits d'autrui est strictement interdite.
        Chaque utilisateur est responsable du contenu qu'il publie.
      </Section>
      <Section title="3. Compte utilisateur">
        Vous êtes responsable de la confidentialité de vos identifiants. Toute activité effectuée
        depuis votre compte vous est attribuée. Signalez immédiatement tout accès non autorisé.
      </Section>
      <Section title="4. Propriété intellectuelle">
        Les contenus que vous créez sur FlowPilot vous appartiennent. La marque, le code et
        les éléments graphiques de la plateforme sont la propriété exclusive de FlowPilot.
      </Section>
      <Section title="5. Disponibilité du service">
        Nous nous efforçons de maintenir FlowPilot disponible en permanence mais ne pouvons
        garantir une disponibilité sans interruption. Des maintenances peuvent être programmées
        avec un préavis raisonnable.
      </Section>
      <Section title="6. Résiliation">
        Vous pouvez supprimer votre compte à tout moment depuis votre profil. FlowPilot se
        réserve le droit de suspendre un compte en cas de violation des présentes conditions.
      </Section>
      <Section title="7. Droit applicable">
        Les présentes conditions sont régies par le droit en vigueur au Cameroun.
        Tout litige sera soumis à la juridiction compétente de Yaoundé.
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--ink)]">{title}</h4>
      <p className="text-xs leading-relaxed text-[var(--ink-2)]">{children}</p>
    </div>
  );
}
