"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { UserPlus, Lock, LockOpen, X, Globe, Plus } from "lucide-react";
import {
  DndContext, DragOverlay, PointerSensor, KeyboardSensor,
  useSensor, useSensors, closestCorners,
  type DragStartEvent, type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, arrayMove, sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useLists } from "../../../hooks/useLists";
import { useBoardWebSocket } from "../../../hooks/useBoardWebSocket";
import ListColumn from "../../../components/ui/ListColumn";
import { BoardsService } from "@/lib/services/BoardsService";
import { BoardMembersService } from "@/lib/services/BoardMembersService";
import { CardsService } from "@/lib/services/CardsService";
import { ListsService } from "@/lib/services/ListsService";
import { Board } from "@/lib/models/Board";
import { BoardMember } from "@/lib/models/BoardMember";
import { Card } from "@/lib/models/Card";
import { List } from "@/lib/models/List";
import { normalizeApiError } from "@/lib/api/client";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/components/ToastContext";

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const boardId = Number(id);
  const { lists, setLists, fetchLists, loading: listsLoading, error: listsError, createList, renameList, deleteList } = useLists(boardId);
  const { user } = useAuth();
  const { toast } = useToast();

  const [board, setBoard]             = useState<Board | null>(null);
  const [members, setMembers]         = useState<BoardMember[]>([]);
  const [boardLoading, setBoardLoading] = useState(true);

  const [newListName, setNewListName] = useState("");
  const [addingList, setAddingList]   = useState(false);
  const [shareOpen, setShareOpen]     = useState(false);

  // Invite form
  const [inviteEmail, setInviteEmail]     = useState("");
  const [inviteRole, setInviteRole]       = useState<"member" | "observer">("member");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError]     = useState<string | null>(null);

  // Member management
  const [roleUpdating, setRoleUpdating] = useState<number | null>(null);
  const [removing, setRemoving]         = useState<number | null>(null);
  const [memberError, setMemberError]   = useState<string | null>(null);

  // ── Card state lifted to board level ─────────────────────────
  const [cardsByList, setCardsByList] = useState<Record<number, Card[]>>({});
  const [cardsLoading, setCardsLoading] = useState<Set<number>>(new Set());
  const fetchedListIds = useRef<Set<number>>(new Set());

  const fetchCardsForList = useCallback(async (listId: number) => {
    setCardsLoading(prev => new Set(prev).add(listId));
    try {
      const data = await CardsService.cardsList({ list: listId, archived: false });
      setCardsByList(prev => ({ ...prev, [listId]: data.results }));
    } catch {
      // error shown per-column via empty state
    } finally {
      setCardsLoading(prev => { const n = new Set(prev); n.delete(listId); return n; });
    }
  }, []);

  useEffect(() => {
    const newIds = lists.map(l => l.list_id!).filter(id => !fetchedListIds.current.has(id));
    newIds.forEach(id => {
      fetchedListIds.current.add(id);
      fetchCardsForList(id);
    });
  }, [lists, fetchCardsForList]);

  // ── Card state helpers ────────────────────────────────────────
  const handleCardCreated = useCallback((listId: number, card: Card) => {
    setCardsByList(prev => ({ ...prev, [listId]: [...(prev[listId] ?? []), card] }));
  }, []);

  const handleCardUpdated = useCallback((listId: number, card: Card) => {
    setCardsByList(prev => ({
      ...prev,
      [listId]: (prev[listId] ?? []).map(c => c.card_id === card.card_id ? card : c),
    }));
  }, []);

  const handleCardDeleted = useCallback((listId: number, cardId: number) => {
    setCardsByList(prev => ({
      ...prev,
      [listId]: (prev[listId] ?? []).filter(c => c.card_id !== cardId),
    }));
  }, []);

  // ── Board fetch ───────────────────────────────────────────────
  const fetchBoard = useCallback(async () => {
    setBoardLoading(true);
    try {
      const [b, m] = await Promise.all([
        BoardsService.boardsRead(String(boardId)),
        BoardsService.boardsMembers(String(boardId)),
      ]);
      setBoard(b);
      setMembers(m);
    } catch (err) {
      toast(normalizeApiError(err), "error");
    } finally {
      setBoardLoading(false);
    }
  }, [boardId, toast]);

  useEffect(() => {
    fetchBoard();
    fetchLists();
  }, [fetchBoard, fetchLists]);

  // ── Member actions ────────────────────────────────────────────
  const handleInvite = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteError(null);
    try {
      await BoardsService.boardsInvite(String(boardId), { email: inviteEmail, role: inviteRole });
      toast(`Invitation envoyée à ${inviteEmail}.`, "success");
      setInviteEmail("");
    } catch (err) {
      const msg = normalizeApiError(err);
      toast(msg, "error");
      setInviteError(msg);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleChangeRole = async (memberId: number, role: BoardMember.role) => {
    setRoleUpdating(memberId);
    setMemberError(null);
    try {
      const updated = await BoardMembersService.boardMembersPartialUpdate(String(memberId), { role });
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: updated.role } : m));
      toast("Rôle mis à jour.", "success");
    } catch (err) {
      const msg = normalizeApiError(err);
      toast(msg, "error");
      setMemberError(msg);
    } finally {
      setRoleUpdating(null);
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    if (!confirm("Retirer ce membre du tableau ?")) return;
    setRemoving(memberId);
    setMemberError(null);
    try {
      await BoardMembersService.boardMembersDelete(String(memberId));
      setMembers(prev => prev.filter(m => m.id !== memberId));
      toast("Membre retiré du tableau.", "success");
    } catch (err) {
      const msg = normalizeApiError(err);
      toast(msg, "error");
      setMemberError(msg);
    } finally {
      setRemoving(null);
    }
  };

  const handleCloseBoard = async () => {
    if (!confirm("Fermer (archiver) ce tableau ?")) return;
    try {
      await BoardsService.boardsClose(String(boardId));
      setBoard(prev => prev ? { ...prev, is_closed: true } : prev);
      toast("Tableau archivé.", "info");
    } catch (err) {
      toast(normalizeApiError(err), "error");
    }
  };

  const handleReopenBoard = async () => {
    try {
      await BoardsService.boardsReopen(String(boardId));
      setBoard(prev => prev ? { ...prev, is_closed: false } : prev);
      toast("Tableau rouvert.", "success");
    } catch (err) {
      toast(normalizeApiError(err), "error");
    }
  };

  // ── WebSocket ─────────────────────────────────────────────────
  useBoardWebSocket(boardId, {
    onCardCreated: (card) => {
      if (!card.list) return;
      setCardsByList(prev => {
        const existing = prev[card.list!] ?? [];
        if (existing.some(c => c.card_id === card.card_id)) return prev;
        return { ...prev, [card.list!]: [...existing, card] };
      });
    },
    onCardUpdated: (card) => {
      if (!card.list) return;
      setCardsByList(prev => ({
        ...prev,
        [card.list!]: (prev[card.list!] ?? []).map(c => c.card_id === card.card_id ? card : c),
      }));
    },
    onCardDeleted: (cardId) => {
      setCardsByList(prev => {
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          const lid = Number(key);
          next[lid] = next[lid].filter(c => c.card_id !== cardId);
        }
        return next;
      });
    },
    onCardMoved: (card) => {
      if (!card.list) return;
      setCardsByList(prev => {
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          const lid = Number(key);
          if (lid !== card.list && next[lid].some(c => c.card_id === card.card_id)) {
            next[lid] = next[lid].filter(c => c.card_id !== card.card_id);
            fetchCardsForList(lid);
          }
        }
        return next;
      });
      fetchCardsForList(card.list);
    },
    onListCreated: () => { fetchedListIds.current = new Set(); fetchLists(); },
    onListUpdated: () => fetchLists(),
    onListDeleted: () => fetchLists(),
    onListMoved:   () => fetchLists(),
  });

  // ── Drag & Drop ───────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const [activeItem, setActiveItem] = useState<
    { type: "list"; list: List } | { type: "card"; card: Card } | null
  >(null);

  const handleDragStart = (event: DragStartEvent) => {
    const strId = String(event.active.id);
    if (strId.startsWith("list-")) {
      const listId = Number(strId.replace("list-", ""));
      const list = lists.find(l => l.list_id === listId);
      if (list) setActiveItem({ type: "list", list });
    } else {
      const cardId = Number(strId.replace("card-", ""));
      for (const cards of Object.values(cardsByList)) {
        const card = cards.find(c => c.card_id === cardId);
        if (card) { setActiveItem({ type: "card", card }); break; }
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeStr = String(active.id);
    const overStr   = String(over.id);

    // ── List reorder ──────────────────────────────────────────
    if (activeStr.startsWith("list-")) {
      const fromListId = Number(activeStr.replace("list-", ""));
      const toListId   = Number(overStr.replace("list-", ""));
      const sorted     = [...lists].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      const fromIndex  = sorted.findIndex(l => l.list_id === fromListId);
      const toIndex    = sorted.findIndex(l => l.list_id === toListId);
      if (fromIndex === -1 || toIndex === -1) return;

      const reordered = arrayMove(sorted, fromIndex, toIndex);
      setLists(reordered);
      try {
        await ListsService.listsMove(String(fromListId), { position: toIndex });
        await fetchLists();
      } catch {
        toast("Impossible de déplacer la liste.", "error");
        await fetchLists();
      }
      return;
    }

    // ── Card reorder / cross-list move ────────────────────────
    const cardId = Number(activeStr.replace("card-", ""));

    let sourceListId: number | null = null;
    let sourceCard: Card | null = null;
    for (const [lid, cards] of Object.entries(cardsByList)) {
      const found = cards.find(c => c.card_id === cardId);
      if (found) { sourceListId = Number(lid); sourceCard = found; break; }
    }
    if (!sourceListId || !sourceCard) return;

    let destListId: number;
    let destIndex: number;

    if (overStr.startsWith("list-")) {
      destListId = Number(overStr.replace("list-", ""));
      destIndex  = (cardsByList[destListId] ?? []).length;
    } else {
      const overCardId = Number(overStr.replace("card-", ""));
      destListId = sourceListId;
      for (const [lid, cards] of Object.entries(cardsByList)) {
        if (cards.some(c => c.card_id === overCardId)) { destListId = Number(lid); break; }
      }
      const destCards = cardsByList[destListId] ?? [];
      const idx = destCards.findIndex(c => c.card_id === overCardId);
      destIndex = idx === -1 ? destCards.length : idx;
    }

    const sourceCards = cardsByList[sourceListId] ?? [];
    if (destListId === sourceListId) {
      const fromIdx = sourceCards.findIndex(c => c.card_id === cardId);
      if (fromIdx === -1) return;
      setCardsByList(prev => ({ ...prev, [sourceListId]: arrayMove(sourceCards, fromIdx, destIndex) }));
    } else {
      const filteredSource = sourceCards.filter(c => c.card_id !== cardId);
      const destCards      = [...(cardsByList[destListId] ?? [])];
      destCards.splice(destIndex, 0, sourceCard);
      setCardsByList(prev => ({ ...prev, [sourceListId]: filteredSource, [destListId]: destCards }));
    }

    try {
      await CardsService.cardsMove(String(cardId), {
        position: destIndex,
        list_id: destListId !== sourceListId ? destListId : undefined,
      });
      fetchCardsForList(sourceListId);
      if (destListId !== sourceListId) fetchCardsForList(destListId);
    } catch {
      toast("Impossible de déplacer la carte.", "error");
      fetchCardsForList(sourceListId);
      if (destListId !== sourceListId) fetchCardsForList(destListId);
    }
  };

  const myRole = members.find(m => m.user_details?.user_id === user?.user_id)?.role;
  const isAdmin = myRole === BoardMember.role.ADMIN;

  const sortedLists = [...lists].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  const bgStyle = board?.background_type === "color"
    ? { backgroundColor: board.background_value }
    : board?.background_type === "image"
      ? {
          backgroundImage: `url(${board.background_value})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : { background: "linear-gradient(135deg,#1e3a5f,#0f2040)" };

  return (
    <div className="flex min-h-screen flex-col" style={bgStyle}>
      {/* ── Board header bar ─────────────────────────────────── */}
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-black/25 px-4 py-2.5 backdrop-blur-sm">
        {/* Board name + status */}
        <div className="mr-auto flex min-w-0 items-center gap-2">
          {boardLoading ? (
            <div className="h-5 w-36 animate-pulse rounded bg-white/20" />
          ) : (
            <h1 className="truncate text-[15px] font-bold text-white">
              {board?.name ?? `Board #${boardId}`}
            </h1>
          )}
          {board?.is_closed && (
            <span className="shrink-0 rounded-full bg-orange-500/30 px-2 py-0.5 text-xs font-bold text-orange-200">
              Archivé
            </span>
          )}
          {board?.visibility && (
            <span className="hidden shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold capitalize text-white/80 sm:flex">
              {board.visibility === "private" ? <Lock size={10} /> : <Globe size={10} />}
              {board.visibility}
            </span>
          )}
        </div>

        {/* Member avatars */}
        <button
          className="flex shrink-0 -space-x-2 transition hover:opacity-80"
          onClick={() => setShareOpen(true)}
          title="Voir les membres"
        >
          {members.slice(0, 5).map(m => (
            <div
              key={m.id}
              title={`${m.user_details?.username ?? `#${m.user}`} — ${m.role}`}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/50 bg-brand-500 text-xs font-black text-white"
            >
              {(m.user_details?.username ?? "?")[0].toUpperCase()}
            </div>
          ))}
          {members.length > 5 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/50 bg-black/40 text-xs font-bold text-white">
              +{members.length - 5}
            </div>
          )}
        </button>

        {/* Partager button */}
        <button
          onClick={() => {
            if (!isAdmin) { toast("Seul un admin peut partager le tableau.", "error"); return; }
            setShareOpen(true);
          }}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
        >
          <UserPlus size={14} />
          <span className="hidden sm:inline">Partager</span>
        </button>

        {/* Admin: close / reopen */}
        {isAdmin && (
          board?.is_closed ? (
            <button
              onClick={handleReopenBoard}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/20 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/30"
            >
              <LockOpen size={14} />
              <span className="hidden sm:inline">Rouvrir</span>
            </button>
          ) : (
            <button
              onClick={handleCloseBoard}
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-red-300/30 bg-red-900/50 px-3 py-1.5 text-sm font-semibold text-red-200 backdrop-blur-sm transition hover:bg-red-900/70"
            >
              <Lock size={14} />
              <span className="hidden sm:inline">Fermer</span>
            </button>
          )
        )}
      </div>

      {/* ── Kanban DnD ─────────────────────────────────────────── */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 items-start gap-4 overflow-x-auto p-4 pb-8">
          {listsError && (
            <div className="rounded-xl bg-red-500/20 p-3 text-sm font-semibold text-red-200 backdrop-blur-sm">
              {listsError}
            </div>
          )}

          <SortableContext
            items={sortedLists.map(l => `list-${l.list_id}`)}
            strategy={horizontalListSortingStrategy}
          >
            {sortedLists.map(list => (
              <ListColumn
                key={list.list_id}
                list={list}
                boardId={boardId}
                cards={cardsByList[list.list_id!] ?? []}
                isLoading={cardsLoading.has(list.list_id!)}
                onRename={renameList}
                onDelete={deleteList}
                onCardCreated={card => handleCardCreated(list.list_id!, card)}
                onCardUpdated={card => handleCardUpdated(list.list_id!, card)}
                onCardDeleted={cardId => handleCardDeleted(list.list_id!, cardId)}
              />
            ))}
          </SortableContext>

          {/* ── Add list ──────────────────────────────────────── */}
          {addingList ? (
            <div className="flex h-fit min-w-72 shrink-0 flex-col gap-2 rounded-xl border border-white/10 bg-black/30 p-3 backdrop-blur-sm">
              <input
                autoFocus
                type="text"
                value={newListName}
                onChange={e => setNewListName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    createList(newListName).then(ok => {
                      if (ok) { setNewListName(""); toast("Liste créée.", "success"); }
                      else toast("Impossible de créer la liste.", "error");
                    });
                  }
                  if (e.key === "Escape") { setAddingList(false); setNewListName(""); }
                }}
                placeholder="Saisissez le titre de la liste…"
                className="w-full rounded-lg border-2 border-brand-500 bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => createList(newListName).then(ok => {
                    if (ok) { setNewListName(""); toast("Liste créée.", "success"); }
                    else toast("Impossible de créer la liste.", "error");
                  })}
                  disabled={listsLoading || !newListName.trim()}
                  className="rounded-lg bg-brand-500 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-40"
                >
                  Ajouter une liste
                </button>
                <button
                  onClick={() => { setAddingList(false); setNewListName(""); }}
                  className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingList(true)}
              className="flex h-fit min-w-72 shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-semibold text-white/80 backdrop-blur-sm transition hover:bg-black/30 hover:text-white"
            >
              <Plus size={16} />
              Ajouter une liste
            </button>
          )}
        </div>

        {/* ── Drag overlay ──────────────────────────────────── */}
        <DragOverlay>
          {activeItem?.type === "card" && (
            <div className="w-72 rounded-xl bg-[var(--surface)] p-3 shadow-2xl opacity-90 rotate-1">
              <p className="text-sm font-semibold text-[var(--ink)]">{activeItem.card.title}</p>
            </div>
          )}
          {activeItem?.type === "list" && (
            <div className="w-72 rounded-xl bg-[var(--surface-3)] px-4 py-3 shadow-2xl opacity-90 rotate-1">
              <p className="text-sm font-bold text-[var(--ink)]">{activeItem.list.name}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* ── Share modal ────────────────────────────────────────── */}
      {shareOpen && (
        <ShareModal
          members={members}
          isAdmin={isAdmin}
          user={user}
          inviteEmail={inviteEmail}
          inviteRole={inviteRole}
          inviteLoading={inviteLoading}
          inviteError={inviteError}
          memberError={memberError}
          roleUpdating={roleUpdating}
          removing={removing}
          onClose={() => setShareOpen(false)}
          onInviteEmailChange={setInviteEmail}
          onInviteRoleChange={setInviteRole}
          onInvite={handleInvite}
          onChangeRole={handleChangeRole}
          onRemoveMember={handleRemoveMember}
        />
      )}
    </div>
  );
}

/* ── Share modal ──────────────────────────────────────────────── */
interface ShareModalProps {
  members: BoardMember[];
  isAdmin: boolean;
  user: { user_id?: number; username?: string } | null;
  inviteEmail: string;
  inviteRole: "member" | "observer";
  inviteLoading: boolean;
  inviteError: string | null;
  memberError: string | null;
  roleUpdating: number | null;
  removing: number | null;
  onClose: () => void;
  onInviteEmailChange: (v: string) => void;
  onInviteRoleChange: (v: "member" | "observer") => void;
  onInvite: (e: { preventDefault(): void }) => void;
  onChangeRole: (memberId: number, role: BoardMember.role) => void;
  onRemoveMember: (memberId: number) => void;
}

function ShareModal({
  members, isAdmin, user,
  inviteEmail, inviteRole, inviteLoading, inviteError,
  memberError, roleUpdating, removing,
  onClose, onInviteEmailChange, onInviteRoleChange,
  onInvite, onChangeRole, onRemoveMember,
}: ShareModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex w-full max-w-md flex-col rounded-2xl bg-[var(--surface)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <h2 className="text-base font-bold text-[var(--ink)]">Partager le tableau</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--ink-3)] transition hover:bg-[var(--line)] hover:text-[var(--ink)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Invite form (admin only) */}
        {isAdmin && (
          <form onSubmit={onInvite} className="border-b border-[var(--line)] px-5 py-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--ink-3)]">
              Inviter par e-mail
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={e => onInviteEmailChange(e.target.value)}
                placeholder="collaborateur@example.com"
                className="min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-[var(--surface-3)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-brand-500 focus:outline-none"
              />
              <select
                value={inviteRole}
                onChange={e => onInviteRoleChange(e.target.value as "member" | "observer")}
                className="rounded-lg border border-[var(--line)] bg-[var(--surface-3)] px-2 py-2 text-sm text-[var(--ink)] focus:border-brand-500 focus:outline-none"
              >
                <option value="member">Membre</option>
                <option value="observer">Observateur</option>
              </select>
              <button
                type="submit"
                disabled={inviteLoading}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-40"
              >
                {inviteLoading ? "…" : "Inviter"}
              </button>
            </div>
            {inviteError && <p className="mt-2 text-xs text-red-500">{inviteError}</p>}
          </form>
        )}

        {/* Members list */}
        <div className="max-h-80 overflow-y-auto px-5 py-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--ink-3)]">
            Membres ({members.length})
          </p>
          {memberError && <p className="mb-3 text-xs text-red-500">{memberError}</p>}
          <div className="flex flex-col gap-1">
            {members.map(m => {
              const isMe = m.user_details?.user_id === user?.user_id;
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-[var(--surface-3)]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-black text-white">
                    {(m.user_details?.username ?? "?")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--ink)]">
                      {m.user_details?.username ?? `Membre #${m.user}`}
                      {isMe && (
                        <span className="ml-1.5 text-xs font-normal text-[var(--ink-3)]">(vous)</span>
                      )}
                    </p>
                    <p className="truncate text-xs text-[var(--ink-3)]">
                      {m.user_details?.email ?? ""}
                    </p>
                  </div>

                  {!isMe && isAdmin ? (
                    <select
                      value={m.role ?? "member"}
                      disabled={roleUpdating === m.id}
                      onChange={e => onChangeRole(m.id!, e.target.value as BoardMember.role)}
                      className="rounded-lg border border-[var(--line)] bg-[var(--surface-3)] px-2 py-1.5 text-xs font-semibold text-[var(--ink)] focus:border-brand-500 focus:outline-none disabled:opacity-50"
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Membre</option>
                      <option value="observer">Observateur</option>
                    </select>
                  ) : (
                    <span className="shrink-0 rounded-full bg-[var(--surface-3)] px-2.5 py-1 text-xs font-semibold capitalize text-[var(--ink-3)]">
                      {m.role}
                    </span>
                  )}

                  {!isMe && isAdmin && (
                    <button
                      onClick={() => onRemoveMember(m.id!)}
                      disabled={removing === m.id}
                      title="Retirer ce membre"
                      className="shrink-0 rounded-lg p-1.5 text-[var(--ink-3)] transition hover:bg-red-50 hover:text-red-500 disabled:opacity-40 dark:hover:bg-red-900/20"
                    >
                      {removing === m.id ? "…" : <X size={14} />}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
