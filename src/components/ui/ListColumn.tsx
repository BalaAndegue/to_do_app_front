"use client";
import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Plus, X, MessageCircle, Calendar } from "lucide-react";
import { useCards } from "../../hooks/useCards";
import { List } from "@/lib";
import CardDetail from "@/components/CardDetail";

/* ── Couleurs déterministes par liste ───────────────────────── */
const LIST_ACCENTS = [
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#84cc16", // lime
];

/* ── Dégradés déterministes par carte ───────────────────────── */
const CARD_COVERS: [string, string][] = [
  ["#60a5fa", "#2563eb"],
  ["#c084fc", "#7c3aed"],
  ["#34d399", "#059669"],
  ["#fb923c", "#ea580c"],
  ["#f472b6", "#db2777"],
  ["#2dd4bf", "#0d9488"],
  ["#818cf8", "#4f46e5"],
  ["#fbbf24", "#d97706"],
];

function cardCover(cardId?: number): string {
  const [a, b] = CARD_COVERS[(cardId ?? 0) % CARD_COVERS.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

interface ListColumnProps {
  list: List;
  boardId: number;
  onRename: (listId: number, name: string) => Promise<void>;
  onDelete: (listId: number) => Promise<void>;
}

export default function ListColumn({ list, boardId, onRename, onDelete }: ListColumnProps) {
  const listId = list.list_id ?? 0;
  const { cards, fetchCards, loading, error, createCard } = useCards(listId);

  const [newCardTitle, setNewCardTitle]     = useState("");
  const [addingCard, setAddingCard]         = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft]     = useState(list.name ?? "");
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const accent = LIST_ACCENTS[(listId) % LIST_ACCENTS.length];

  useEffect(() => { fetchCards(); }, [fetchCards]);

  useEffect(() => {
    if (editingTitle) titleInputRef.current?.select();
  }, [editingTitle]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleCreateCard = async () => {
    const trimmed = newCardTitle.trim();
    if (!trimmed) return;
    const ok = await createCard(trimmed);
    if (ok) { setNewCardTitle(""); setAddingCard(false); }
  };

  const saveTitle = async () => {
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== list.name) await onRename(listId, trimmed);
    setEditingTitle(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Supprimer la liste "${list.name}" et toutes ses cartes ?`)) return;
    setMenuOpen(false);
    await onDelete(listId);
  };

  return (
    <div className="flex w-72 flex-shrink-0 flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface-3)] shadow-card">
      {/* Bande colorée en haut */}
      <div className="h-1 w-full rounded-t-2xl" style={{ background: accent }} />

      {/* ── En-tête ─────────────────────────────────── */}
      <div className="flex items-center gap-2 px-3 pb-2 pt-3">
        {editingTitle ? (
          <input
            ref={titleInputRef}
            value={titleDraft}
            onChange={e => setTitleDraft(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={e => {
              if (e.key === "Enter") saveTitle();
              if (e.key === "Escape") { setTitleDraft(list.name ?? ""); setEditingTitle(false); }
            }}
            className="flex-1 rounded-lg border-2 bg-[var(--surface)] px-2 py-1 text-sm font-bold text-[var(--ink)] focus:outline-none"
            style={{ borderColor: accent }}
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="flex-1 truncate text-left text-sm font-bold text-[var(--ink)] transition hover:opacity-70"
            title="Cliquer pour renommer"
          >
            {list.name}
          </button>
        )}

        <span className="rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: accent }}>
          {cards.length}
        </span>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex h-6 w-6 items-center justify-center rounded-lg text-[var(--ink-3)] transition hover:bg-[var(--line)] hover:text-[var(--ink)]"
          >
            <MoreHorizontal size={14} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-7 z-20 min-w-44 rounded-xl border border-[var(--line)] bg-[var(--surface)] shadow-card-lg">
              <button
                onClick={() => { setEditingTitle(true); setMenuOpen(false); }}
                className="w-full rounded-t-xl px-4 py-2.5 text-left text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--surface-3)]"
              >
                Renommer la liste
              </button>
              <button
                onClick={handleDelete}
                className="w-full rounded-b-xl px-4 py-2.5 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Supprimer la liste
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Cartes ─────────────────────────────────── */}
      <div className="flex flex-col gap-2 overflow-y-auto px-3 pb-2" style={{ maxHeight: "calc(100vh - 280px)" }}>
        {loading && <div className="shimmer h-20 rounded-xl" />}
        {error && (
          <div className="rounded-xl bg-red-100 p-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</div>
        )}

        {cards
          .slice()
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          .map(card => {
            const hasLabels      = (card.labels?.length ?? 0) > 0;
            const hasMembers     = (card.members?.length ?? 0) > 0;
            const hasDue         = !!card.due_date;
            const isOverdue      = hasDue && !card.due_date_complete && new Date(card.due_date!) < new Date();
            const commentsCount  = card.comments_count ?? 0;
            const coverGradient  = cardCover(card.card_id);
            const labelColor     = hasLabels ? card.labels![0].label_details?.color : null;
            const leftBorder     = labelColor ? `3px solid ${labelColor}` : `3px solid transparent`;

            return (
              <button
                key={card.card_id}
                onClick={() => setSelectedCardId(card.card_id ?? null)}
                className="group w-full cursor-pointer overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] text-left transition hover:border-[var(--line-strong)] hover:shadow-card"
                style={{ borderLeft: leftBorder }}
              >
                {/* Couverture dégradée */}
                <div className="h-8 w-full opacity-70" style={{ background: coverGradient }} />

                <div className="p-3 pt-2">
                  {/* Label chips */}
                  {hasLabels && (
                    <div className="mb-1.5 flex flex-wrap gap-1">
                      {card.labels!.map(cl => (
                        <span
                          key={cl.id}
                          className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                          style={{ backgroundColor: cl.label_details?.color ?? "#888" }}
                        >
                          {cl.label_details?.name ?? ""}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm font-semibold text-[var(--ink)] group-hover:text-brand-600 transition">
                    {card.title}
                  </p>

                  {/* Métadonnées */}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {hasDue && (
                      <span className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ${
                        card.due_date_complete
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : isOverdue
                            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-[var(--surface-3)] text-[var(--ink-3)]"
                      }`}>
                        <Calendar size={10} />
                        {new Date(card.due_date!).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                      </span>
                    )}
                    {commentsCount > 0 && (
                      <span className="flex items-center gap-1 text-xs text-[var(--ink-3)]">
                        <MessageCircle size={11} />{commentsCount}
                      </span>
                    )}
                    {hasMembers && (
                      <div className="ml-auto flex gap-0.5">
                        {card.members!.slice(0, 3).map(m => (
                          <span
                            key={m.id}
                            title={m.user_details?.username ?? `#${m.user}`}
                            className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-black text-white"
                            style={{ background: accent }}
                          >
                            {(m.user_details?.username ?? "?").substring(0, 1).toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
      </div>

      {/* ── Ajouter une carte ──────────────────────── */}
      <div className="px-3 pb-3">
        {addingCard ? (
          <div className="flex flex-col gap-2">
            <textarea
              autoFocus
              rows={2}
              value={newCardTitle}
              onChange={e => setNewCardTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleCreateCard(); }
                if (e.key === "Escape") { setAddingCard(false); setNewCardTitle(""); }
              }}
              placeholder="Titre de la carte…"
              className="w-full resize-none rounded-xl border-2 bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none"
              style={{ borderColor: accent }}
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreateCard}
                disabled={!newCardTitle.trim()}
                className="rounded-xl px-4 py-1.5 text-sm font-bold text-white transition disabled:opacity-40"
                style={{ background: accent }}
              >
                Ajouter
              </button>
              <button
                onClick={() => { setAddingCard(false); setNewCardTitle(""); }}
                className="rounded-xl p-1.5 text-[var(--ink-3)] transition hover:bg-[var(--line)] hover:text-[var(--ink)]"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingCard(true)}
            className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-[var(--ink-3)] transition hover:bg-[var(--line)] hover:text-[var(--ink)]"
          >
            <Plus size={15} />
            Ajouter une carte
          </button>
        )}
      </div>

      {selectedCardId !== null && (
        <CardDetail
          cardId={selectedCardId}
          boardId={boardId}
          onClose={() => setSelectedCardId(null)}
          onCardUpdated={() => fetchCards()}
          onCardDeleted={() => { fetchCards(); setSelectedCardId(null); }}
        />
      )}
    </div>
  );
}
