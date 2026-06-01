"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  MoreHorizontal, Plus, X, MessageCircle, Calendar,
  GripVertical, Paperclip, CheckSquare, Pencil, Check,
  Copy, Archive, ArrowRight, Link as LinkIcon, Tag, Users,
  Clock, AlignLeft, ChevronRight,
} from "lucide-react";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { List, Card } from "@/lib";
import { CardsService } from "@/lib/services/CardsService";
import { ListsService } from "@/lib/services/ListsService";
import { normalizeApiError } from "@/lib/api/client";
import CardDetail from "@/components/CardDetail";
import { useToast } from "@/components/ToastContext";

const LIST_ACCENTS = [
  "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b",
  "#ef4444", "#06b6d4", "#ec4899", "#84cc16",
];

type CardDetailPanel = "labels" | "members" | "dates" | "checklist" | "attachments";

interface ListColumnProps {
  list: List;
  boardId: number;
  cards: Card[];
  isLoading?: boolean;
  onRename: (listId: number, name: string) => Promise<void>;
  onDelete: (listId: number) => Promise<void>;
  onArchive: (listId: number) => void;
  onCardCreated: (card: Card) => void;
  onCardUpdated: (card: Card) => void;
  onCardDeleted: (cardId: number) => void;
}

export default function ListColumn({
  list, boardId, cards, isLoading,
  onRename, onDelete, onArchive, onCardCreated, onCardUpdated, onCardDeleted,
}: ListColumnProps) {
  const listId = list.list_id ?? 0;
  const accent = LIST_ACCENTS[listId % LIST_ACCENTS.length];
  const { toast } = useToast();

  /* ── Drag-and-drop list ─────────────────────────── */
  const {
    attributes: listAttrs, listeners: listListeners,
    setNodeRef: setListRef, transform: listTransform,
    transition: listTransition, isDragging: isListDragging,
  } = useSortable({ id: `list-${listId}` });

  const listStyle = {
    transform: CSS.Transform.toString(listTransform),
    transition: listTransition,
    opacity: isListDragging ? 0.4 : 1,
  };

  /* ── State ──────────────────────────────────────── */
  const [newCardTitle, setNewCardTitle] = useState("");
  const [addingCard, setAddingCard]     = useState(false);
  const [creating, setCreating]         = useState(false);
  const [createError, setCreateError]   = useState<string | null>(null);

  // Card detail modal
  const [selectedCardId, setSelectedCardId]         = useState<number | null>(null);
  const [defaultPanel, setDefaultPanel]             = useState<CardDetailPanel | undefined>();

  // List title inline edit
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft]     = useState(list.name ?? "");
  const titleInputRef = useRef<HTMLInputElement>(null);

  // List context menu
  const [listMenuOpen, setListMenuOpen]     = useState(false);
  const [sortSubmenu, setSortSubmenu]       = useState(false);
  const listMenuRef = useRef<HTMLDivElement>(null);

  // Card inline title edit
  const [inlineEditId, setInlineEditId]     = useState<number | null>(null);
  const [inlineEditDraft, setInlineEditDraft] = useState("");
  const inlineInputRef = useRef<HTMLTextAreaElement>(null);

  // Card context menu — fixed positioning to escape overflow-y-auto clipping
  const [cardMenuId, setCardMenuId]   = useState<number | null>(null);
  const [cardMenuPos, setCardMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const cardMenuRef = useRef<HTMLDivElement>(null);

  // Local sort
  const [sortOrder, setSortOrder] = useState<"name_asc" | "due_asc" | null>(null);

  /* ── Auto-focus effects ─────────────────────────── */
  useEffect(() => { if (editingTitle) titleInputRef.current?.select(); }, [editingTitle]);
  useEffect(() => { if (inlineEditId !== null) inlineInputRef.current?.select(); }, [inlineEditId]);

  /* ── Close menus on outside click ───────────────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (listMenuRef.current && !listMenuRef.current.contains(e.target as Node)) {
        setListMenuOpen(false); setSortSubmenu(false);
      }
      if (cardMenuRef.current && !cardMenuRef.current.contains(e.target as Node)) {
        setCardMenuId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Sorted cards ───────────────────────────────── */
  const sortedCards = [...cards].sort((a, b) => {
    if (sortOrder === "name_asc") return a.title.localeCompare(b.title);
    if (sortOrder === "due_asc") {
      const da = a.due_date ? new Date(a.due_date).getTime() : Infinity;
      const db = b.due_date ? new Date(b.due_date).getTime() : Infinity;
      return da - db;
    }
    return (a.position ?? 0) - (b.position ?? 0);
  });

  /* ── Handlers ───────────────────────────────────── */
  const handleCreateCard = async () => {
    const trimmed = newCardTitle.trim();
    if (!trimmed) return;
    setCreating(true); setCreateError(null);
    try {
      const card = await CardsService.cardsCreate({ title: trimmed, list: listId, position: cards.length });
      onCardCreated(card);
      setNewCardTitle(""); setAddingCard(false);
    } catch (err) { setCreateError(normalizeApiError(err)); }
    finally { setCreating(false); }
  };

  const saveListTitle = async () => {
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== list.name) await onRename(listId, trimmed);
    setEditingTitle(false);
  };

  const handleArchiveList = async () => {
    if (!confirm(`Archiver la liste "${list.name}" ?`)) return;
    setListMenuOpen(false);
    try {
      await ListsService.listsArchive(String(listId));
      onArchive(listId);
      toast("Liste archivée.", "info");
    } catch (err) { toast(normalizeApiError(err), "error"); }
  };

  const handleDeleteList = async () => {
    if (!confirm(`Supprimer définitivement la liste "${list.name}" et toutes ses cartes ?`)) return;
    setListMenuOpen(false);
    await onDelete(listId);
  };

  const handleArchiveAllCards = async () => {
    if (!confirm(`Archiver toutes les cartes de "${list.name}" ?`)) return;
    setListMenuOpen(false);
    try {
      await ListsService.listsArchiveCards(String(listId));
      cards.forEach(c => { if (c.card_id) onCardDeleted(c.card_id); });
      toast("Toutes les cartes ont été archivées.", "info");
    } catch (err) { toast(normalizeApiError(err), "error"); }
  };

  const handleCopyList = async () => {
    setListMenuOpen(false);
    try {
      const copy = await ListsService.listsCreate({ name: `${list.name} (copie)`, board: list.board, position: list.position + 1 });
      toast(`Liste "${copy.name}" créée.`, "success");
    } catch (err) { toast(normalizeApiError(err), "error"); }
  };

  const handleSaveInlineTitle = useCallback(async (cardId: number) => {
    const trimmed = inlineEditDraft.trim();
    setInlineEditId(null);
    if (!trimmed) return;
    const card = cards.find(c => c.card_id === cardId);
    if (!card || trimmed === card.title) return;
    try {
      const updated = await CardsService.cardsPartialUpdate(String(cardId), { title: trimmed });
      onCardUpdated(updated);
    } catch (err) { toast(normalizeApiError(err), "error"); }
  }, [inlineEditDraft, cards, onCardUpdated, toast]);

  const handleCardAction = useCallback(async (cardId: number, action: string) => {
    setCardMenuId(null);
    const card = cards.find(c => c.card_id === cardId);
    if (!card) return;

    switch (action) {
      case "open":
        setDefaultPanel(undefined);
        setSelectedCardId(cardId);
        break;
      case "labels":
        setDefaultPanel("labels");
        setSelectedCardId(cardId);
        break;
      case "members":
        setDefaultPanel("members");
        setSelectedCardId(cardId);
        break;
      case "dates":
        setDefaultPanel("dates");
        setSelectedCardId(cardId);
        break;
      case "checklist":
        setDefaultPanel("checklist");
        setSelectedCardId(cardId);
        break;
      case "rename":
        setInlineEditId(cardId);
        setInlineEditDraft(card.title);
        break;
      case "archive":
        try {
          await CardsService.cardsArchive(String(cardId));
          onCardDeleted(cardId);
          toast("Carte archivée.", "info");
        } catch (err) { toast(normalizeApiError(err), "error"); }
        break;
      case "copy":
        try {
          const res = await CardsService.cardsCopy(String(cardId));
          onCardCreated(res.data);
          toast("Carte copiée.", "success");
        } catch (err) { toast(normalizeApiError(err), "error"); }
        break;
      case "link": {
        const url = `${window.location.origin}/board/${boardId}?card=${cardId}`;
        await navigator.clipboard.writeText(url);
        toast("Lien copié.", "success");
        break;
      }
    }
  }, [cards, boardId, onCardCreated, onCardDeleted, toast]);

  return (
    <div
      ref={setListRef}
      style={listStyle}
      {...listAttrs}
      className="flex w-72 flex-shrink-0 flex-col rounded-xl bg-[var(--surface-3)] dark:bg-[#2c2f38] shadow-card"
    >
      {/* ── En-tête ─────────────────────────────────── */}
      <div className="flex items-center gap-1.5 px-3 py-2.5">
        <button
          {...listListeners}
          className="flex-shrink-0 cursor-grab text-[var(--ink-3)] transition hover:text-[var(--ink)] active:cursor-grabbing"
          tabIndex={-1}
        >
          <GripVertical size={13} />
        </button>

        {editingTitle ? (
          <input
            ref={titleInputRef}
            value={titleDraft}
            onChange={e => setTitleDraft(e.target.value)}
            onBlur={saveListTitle}
            onKeyDown={e => {
              if (e.key === "Enter") saveListTitle();
              if (e.key === "Escape") { setTitleDraft(list.name ?? ""); setEditingTitle(false); }
            }}
            className="flex-1 rounded-md border-2 border-brand-500 bg-[var(--surface)] px-2 py-1 text-sm font-bold text-[var(--ink)] focus:outline-none"
          />
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="flex-1 truncate text-left text-sm font-bold text-[var(--ink)] hover:opacity-70 transition"
          >
            {list.name}
          </button>
        )}

        <span className="flex-shrink-0 rounded-md bg-[var(--line)] px-1.5 py-0.5 text-xs font-bold text-[var(--ink-2)]">
          {cards.length}
        </span>

        {/* ── List context menu ───────────────────── */}
        <div ref={listMenuRef} className="relative flex-shrink-0">
          <button
            onClick={() => { setListMenuOpen(v => !v); setSortSubmenu(false); }}
            className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--ink-3)] transition hover:bg-[var(--line)] hover:text-[var(--ink)]"
          >
            <MoreHorizontal size={14} />
          </button>

          {listMenuOpen && (
            <div className="absolute right-0 top-7 z-30 w-56 rounded-xl border border-[var(--line)] bg-[var(--surface)] py-1 shadow-card-lg">
              <p className="px-4 py-2 text-center text-xs font-bold uppercase tracking-widest text-[var(--ink-3)]">
                Actions de la liste
              </p>

              <MenuItem icon={<Plus size={13}/>} label="Ajouter une carte" onClick={() => { setAddingCard(true); setListMenuOpen(false); }} />
              <div className="my-1 border-t border-[var(--line)]" />

              {/* Sort submenu */}
              <div className="relative">
                <button
                  onMouseEnter={() => setSortSubmenu(true)}
                  onClick={() => setSortSubmenu(v => !v)}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-[var(--ink)] transition hover:bg-[var(--surface-3)]"
                >
                  <AlignLeft size={13} className="text-[var(--ink-3)]" />
                  <span className="flex-1 text-left">Trier par</span>
                  <ChevronRight size={12} className="text-[var(--ink-3)]" />
                </button>
                {sortSubmenu && (
                  <div className="absolute left-full top-0 z-40 ml-1 w-44 rounded-xl border border-[var(--line)] bg-[var(--surface)] py-1 shadow-card-lg">
                    <button onClick={() => { setSortOrder("name_asc"); setListMenuOpen(false); setSortSubmenu(false); }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--surface-3)]">
                      {sortOrder === "name_asc" && <Check size={12} className="text-brand-500" />}
                      <span className={sortOrder === "name_asc" ? "ml-0" : "ml-4"}>Nom (A → Z)</span>
                    </button>
                    <button onClick={() => { setSortOrder("due_asc"); setListMenuOpen(false); setSortSubmenu(false); }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--surface-3)]">
                      {sortOrder === "due_asc" && <Check size={12} className="text-brand-500" />}
                      <span className={sortOrder === "due_asc" ? "ml-0" : "ml-4"}>Échéance</span>
                    </button>
                    {sortOrder && (
                      <button onClick={() => { setSortOrder(null); setListMenuOpen(false); setSortSubmenu(false); }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <X size={12} />Réinitialiser
                      </button>
                    )}
                  </div>
                )}
              </div>

              <MenuItem icon={<Copy size={13}/>} label="Copier la liste" onClick={handleCopyList} />
              <div className="my-1 border-t border-[var(--line)]" />
              <MenuItem icon={<Archive size={13}/>} label="Archiver toutes les cartes" onClick={handleArchiveAllCards} />
              <MenuItem icon={<Archive size={13}/>} label="Archiver cette liste" onClick={handleArchiveList} />
              <div className="my-1 border-t border-[var(--line)]" />
              <button onClick={handleDeleteList}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-xl">
                <X size={13} />Supprimer la liste
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Cartes ─────────────────────────────────── */}
      <div className="flex flex-col gap-2 overflow-y-auto px-2 pb-1" style={{ maxHeight: "calc(100vh - 200px)", minHeight: "4px" }}>
        {isLoading && <div className="shimmer h-16 rounded-lg" />}
        <SortableContext items={sortedCards.map(c => `card-${c.card_id}`)} strategy={verticalListSortingStrategy}>
          {sortedCards.map(card => (
            <SortableCard
              key={card.card_id}
              card={card}
              accent={accent}
              isInlineEditing={inlineEditId === card.card_id}
              inlineEditDraft={inlineEditDraft}
              inlineInputRef={inlineEditId === card.card_id ? inlineInputRef : undefined}
              onInlineChange={setInlineEditDraft}
              onInlineSave={() => handleSaveInlineTitle(card.card_id!)}
              onInlineCancel={() => setInlineEditId(null)}
              onMenuToggle={(id, rect) => {
                if (cardMenuId === id) { setCardMenuId(null); return; }
                setCardMenuId(id);
                const menuW = 208;
                setCardMenuPos({
                  top: rect.bottom + 4,
                  left: Math.max(8, rect.right - menuW),
                });
              }}
              onAction={(action) => handleCardAction(card.card_id!, action)}
              onClick={() => { setDefaultPanel(undefined); setSelectedCardId(card.card_id ?? null); }}
            />
          ))}
        </SortableContext>
      </div>

      {/* ── Ajouter une carte ──────────────────────── */}
      <div className="px-2 pb-2 pt-1">
        {addingCard ? (
          <div className="flex flex-col gap-2">
            <textarea
              autoFocus rows={3}
              value={newCardTitle}
              onChange={e => setNewCardTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleCreateCard(); }
                if (e.key === "Escape") { setAddingCard(false); setNewCardTitle(""); }
              }}
              placeholder="Saisissez un titre pour cette carte…"
              className="w-full resize-none rounded-lg border-2 border-brand-500 bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] shadow-sm focus:outline-none"
            />
            {createError && <p className="text-xs text-red-500">{createError}</p>}
            <div className="flex items-center gap-2">
              <button onClick={handleCreateCard} disabled={!newCardTitle.trim() || creating}
                className="rounded-lg bg-brand-500 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-40">
                {creating ? "…" : "Ajouter une carte"}
              </button>
              <button onClick={() => { setAddingCard(false); setNewCardTitle(""); setCreateError(null); }}
                className="rounded-lg p-1.5 text-[var(--ink-3)] transition hover:bg-[var(--line)] hover:text-[var(--ink)]">
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddingCard(true)}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-[var(--ink-3)] transition hover:bg-[var(--line)] hover:text-[var(--ink)]">
            <Plus size={14} />Ajouter une carte
          </button>
        )}
      </div>

      {/* ── Card context menu — fixed, escapes overflow clipping ── */}
      {cardMenuId !== null && (() => {
        const action = (a: string) => handleCardAction(cardMenuId, a);
        return (
          <div
            ref={cardMenuRef}
            style={{ position: "fixed", top: cardMenuPos.top, left: cardMenuPos.left, zIndex: 9999 }}
            className="w-52 rounded-xl border border-[var(--line)] bg-[var(--surface)] py-1 shadow-card-lg"
            onClick={e => e.stopPropagation()}
          >
            <CardMenuItem icon={<ArrowRight size={13}/>} label="Ouvrir la carte"        onClick={() => action("open")} />
            <div className="my-1 border-t border-[var(--line)]" />
            <CardMenuItem icon={<Pencil size={13}/>}    label="Renommer"                onClick={() => action("rename")} />
            <CardMenuItem icon={<Tag size={13}/>}       label="Modifier les étiquettes" onClick={() => action("labels")} />
            <CardMenuItem icon={<Users size={13}/>}     label="Modifier les membres"    onClick={() => action("members")} />
            <CardMenuItem icon={<Clock size={13}/>}     label="Modifier les dates"      onClick={() => action("dates")} />
            <CardMenuItem icon={<CheckSquare size={13}/>} label="Checklist"             onClick={() => action("checklist")} />
            <div className="my-1 border-t border-[var(--line)]" />
            <CardMenuItem icon={<ArrowRight size={13}/>} label="Déplacer"               onClick={() => action("open")} />
            <CardMenuItem icon={<Copy size={13}/>}      label="Copier la carte"         onClick={() => action("copy")} />
            <CardMenuItem icon={<LinkIcon size={13}/>}  label="Copier le lien"          onClick={() => action("link")} />
            <div className="my-1 border-t border-[var(--line)]" />
            <button onClick={() => action("archive")}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-orange-600 transition hover:bg-orange-50 dark:hover:bg-orange-900/20">
              <Archive size={13} />Archiver
            </button>
          </div>
        );
      })()}

      {/* ── Card detail modal ──────────────────────── */}
      {selectedCardId !== null && (
        <CardDetail
          cardId={selectedCardId}
          boardId={boardId}
          onClose={() => { setSelectedCardId(null); setDefaultPanel(undefined); }}
          onCardUpdated={card => onCardUpdated(card)}
          onCardDeleted={cardId => { onCardDeleted(cardId); setSelectedCardId(null); }}
          defaultPanel={defaultPanel}
        />
      )}
    </div>
  );
}

/* ── Menu item helper ───────────────────────────────────────── */
function MenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-[var(--ink)] transition hover:bg-[var(--surface-3)]">
      <span className="text-[var(--ink-3)]">{icon}</span>{label}
    </button>
  );
}

/* ── Sortable card ──────────────────────────────────────────── */
interface SortableCardProps {
  card: Card;
  accent: string;
  isInlineEditing: boolean;
  inlineEditDraft: string;
  inlineInputRef?: React.RefObject<HTMLTextAreaElement | null>;
  onInlineChange: (v: string) => void;
  onInlineSave: () => void;
  onInlineCancel: () => void;
  onMenuToggle: (id: number, rect: DOMRect) => void;
  onAction: (action: string) => void;
  onClick: () => void;
}

function SortableCard({
  card, accent,
  isInlineEditing, inlineEditDraft, inlineInputRef, onInlineChange, onInlineSave, onInlineCancel,
  onMenuToggle, onClick,
}: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `card-${card.card_id}` });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };

  const hasLabels     = (card.labels?.length ?? 0) > 0;
  const hasMembers    = (card.members?.length ?? 0) > 0;
  const hasDue        = !!card.due_date;
  const isOverdue     = hasDue && !card.due_date_complete && new Date(card.due_date!) < new Date();
  const commentsCount = card.comments_count ?? 0;
  const checklistTotal = card.checklists?.reduce((s, cl) => s + (cl.items?.length ?? 0), 0) ?? 0;
  const checklistDone  = card.checklists?.reduce((s, cl) => s + (cl.items?.filter(i => i.checked).length ?? 0), 0) ?? 0;
  const hasChecklist   = checklistTotal > 0;
  const attachCount    = card.attachments?.length ?? 0;
  const hasBadges      = hasDue || commentsCount > 0 || hasChecklist || attachCount > 0 || hasMembers;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative select-none rounded-lg bg-[var(--surface)] shadow-sm transition hover:shadow-md hover:outline hover:outline-2 hover:outline-brand-400"
    >
      {/* ── Quick-edit pencil button ──────────────── */}
      <div
        className="absolute right-1 top-1 z-10 opacity-0 group-hover:opacity-100 transition"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={e => {
            e.stopPropagation();
            onMenuToggle(card.card_id!, e.currentTarget.getBoundingClientRect());
          }}
          className="flex h-6 w-6 items-center justify-center rounded bg-[var(--surface-3)] text-[var(--ink-2)] shadow-sm transition hover:bg-brand-500 hover:text-white"
        >
          <Pencil size={11} />
        </button>
      </div>

      {/* ── Click zone → open modal ──────────────── */}
      <div onClick={isInlineEditing ? undefined : onClick} className={isInlineEditing ? "" : "cursor-pointer"}>
        {/* Label bands */}
        {hasLabels && (
          <div className="flex gap-1 px-3 pt-2">
            {card.labels!.map(cl => (
              <div key={cl.id} className="h-2 min-w-8 flex-1 max-w-20 rounded-full"
                style={{ backgroundColor: cl.label_details?.color ?? "#888" }}
                title={cl.label_details?.name ?? ""} />
            ))}
          </div>
        )}

        <div className={`px-3 pb-2.5 ${hasLabels ? "pt-1.5" : "pt-2.5"}`}>
          {/* ── Inline title edit or static title ── */}
          {isInlineEditing ? (
            <div onClick={e => e.stopPropagation()} className="flex flex-col gap-2">
              <textarea
                ref={inlineInputRef}
                rows={2}
                value={inlineEditDraft}
                onChange={e => onInlineChange(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onInlineSave(); }
                  if (e.key === "Escape") onInlineCancel();
                }}
                className="w-full resize-none rounded-md border-2 border-brand-500 bg-[var(--surface)] px-2 py-1 text-sm font-medium text-[var(--ink)] focus:outline-none"
              />
              <div className="flex gap-1.5">
                <button onClick={onInlineSave}
                  className="rounded-md bg-brand-500 px-3 py-1 text-xs font-bold text-white transition hover:bg-brand-600">
                  Enregistrer
                </button>
                <button onClick={onInlineCancel}
                  className="rounded-md border border-[var(--line)] px-2 py-1 text-xs text-[var(--ink-2)] transition hover:bg-[var(--surface-3)]">
                  <X size={12} />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm font-medium leading-snug text-[var(--ink)]">{card.title}</p>
          )}

          {/* Badges */}
          {hasBadges && !isInlineEditing && (
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {hasDue && (
                  <span className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-semibold ${
                    card.due_date_complete ? "bg-green-500 text-white"
                      : isOverdue ? "bg-red-500 text-white"
                      : "bg-[var(--surface-3)] text-[var(--ink-3)]"
                  }`}>
                    <Calendar size={10} />
                    {new Date(card.due_date!).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                  </span>
                )}
                {commentsCount > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-[var(--ink-3)]">
                    <MessageCircle size={11} />{commentsCount}
                  </span>
                )}
                {hasChecklist && (
                  <span className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-semibold ${
                    checklistDone === checklistTotal ? "bg-green-500 text-white" : "bg-[var(--surface-3)] text-[var(--ink-3)]"
                  }`}>
                    <CheckSquare size={10} />{checklistDone}/{checklistTotal}
                  </span>
                )}
                {attachCount > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-[var(--ink-3)]">
                    <Paperclip size={10} />{attachCount}
                  </span>
                )}
              </div>
              {hasMembers && (
                <div className="flex -space-x-1.5">
                  {card.members!.slice(0, 4).map(m => (
                    <span key={m.id} title={m.user_details?.username ?? `#${m.user}`}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black text-white ring-2 ring-[var(--surface)]"
                      style={{ background: accent }}>
                      {(m.user_details?.username ?? "?")[0].toUpperCase()}
                    </span>
                  ))}
                  {card.members!.length > 4 && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface-3)] text-[10px] font-bold text-[var(--ink-3)] ring-2 ring-[var(--surface)]">
                      +{card.members!.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CardMenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-[var(--ink)] transition hover:bg-[var(--surface-3)]">
      <span className="text-[var(--ink-3)]">{icon}</span>{label}
    </button>
  );
}
