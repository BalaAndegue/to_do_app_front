"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { UserPlus, Users, LockOpen, Lock } from "lucide-react";
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
import Button from "../../../components/ui/Button";
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

type Panel = "invite" | "members" | null;

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const boardId = Number(id);
  const { lists, setLists, fetchLists, loading: listsLoading, error: listsError, createList, renameList, deleteList } = useLists(boardId);
  const { user } = useAuth();
  const { toast } = useToast();

  const [board, setBoard]       = useState<Board | null>(null);
  const [members, setMembers]   = useState<BoardMember[]>([]);
  const [boardLoading, setBoardLoading] = useState(true);
  const [boardError, setBoardError]     = useState<string | null>(null);

  const [newListName, setNewListName] = useState("");
  const [activePanel, setActivePanel] = useState<Panel>(null);

  // Invite form
  const [inviteEmail, setInviteEmail]     = useState("");
  const [inviteRole, setInviteRole]       = useState<"member" | "observer">("member");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMsg, setInviteMsg]         = useState<string | null>(null);
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
    setCardsByList(prev => ({
      ...prev,
      [listId]: [...(prev[listId] ?? []), card],
    }));
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
    setBoardError(null);
    try {
      const [b, m] = await Promise.all([
        BoardsService.boardsRead(String(boardId)),
        BoardsService.boardsMembers(String(boardId)),
      ]);
      setBoard(b);
      setMembers(m);
    } catch (err) {
      setBoardError(normalizeApiError(err));
    } finally {
      setBoardLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchBoard();
    fetchLists();
  }, [fetchBoard, fetchLists]);

  // ── Member actions ────────────────────────────────────────────
  const handleInvite = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteMsg(null);
    setInviteError(null);
    try {
      await BoardsService.boardsInvite(String(boardId), { email: inviteEmail, role: inviteRole });
      toast(`Invitation envoyée à ${inviteEmail}.`, "success");
      setInviteMsg(`Invitation envoyée à ${inviteEmail}.`);
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
      const msg = normalizeApiError(err);
      toast(msg, "error");
      setBoardError(msg);
    }
  };

  const handleReopenBoard = async () => {
    try {
      await BoardsService.boardsReopen(String(boardId));
      setBoard(prev => prev ? { ...prev, is_closed: false } : prev);
      toast("Tableau rouvert.", "success");
    } catch (err) {
      const msg = normalizeApiError(err);
      toast(msg, "error");
      setBoardError(msg);
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
        [card.list!]: (prev[card.list!] ?? []).map(c =>
          c.card_id === card.card_id ? card : c
        ),
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
      // Remove the card from whichever list currently holds it, then re-fetch
      // the destination (and former source if different) to get correct positions.
      setCardsByList(prev => {
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          const lid = Number(key);
          if (lid !== card.list && next[lid].some(c => c.card_id === card.card_id)) {
            next[lid] = next[lid].filter(c => c.card_id !== card.card_id);
            fetchCardsForList(lid); // sync positions of the old list
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
      setLists(reordered); // optimistic
      try {
        await ListsService.listsMove(String(fromListId), { position: toIndex });
        await fetchLists();
      } catch {
        toast("Impossible de déplacer la liste.", "error");
        await fetchLists(); // revert
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

    // Optimistic update
    const sourceCards = cardsByList[sourceListId] ?? [];
    if (destListId === sourceListId) {
      const fromIdx = sourceCards.findIndex(c => c.card_id === cardId);
      if (fromIdx === -1) return;
      setCardsByList(prev => ({
        ...prev,
        [sourceListId]: arrayMove(sourceCards, fromIdx, destIndex),
      }));
    } else {
      const filteredSource = sourceCards.filter(c => c.card_id !== cardId);
      const destCards      = [...(cardsByList[destListId] ?? [])];
      destCards.splice(destIndex, 0, sourceCard);
      setCardsByList(prev => ({
        ...prev,
        [sourceListId]: filteredSource,
        [destListId]:   destCards,
      }));
    }

    try {
      await CardsService.cardsMove(String(cardId), {
        position: destIndex,
        list_id: destListId !== sourceListId ? destListId : undefined,
      });
      // Backend atomically shifts all positions — sync local state
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
          backgroundImage: `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url(${board.background_value})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : { background: "linear-gradient(135deg,#1e3a5f,#0f2040)" };

  const togglePanel = (panel: Panel) => setActivePanel(prev => prev === panel ? null : panel);

  return (
    <div className="mx-auto flex w-full max-w-[100vw] flex-col gap-6 px-6 py-10">
      {/* ── En-tête du board ────────────────────────────── */}
      <section className="rounded-3xl border border-white/10 p-6 text-white shadow-lg" style={bgStyle}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">Board</p>
              {board?.is_closed && (
                <span className="rounded-full bg-orange-500/30 px-3 py-0.5 text-xs font-bold text-orange-200">
                  Archivé
                </span>
              )}
            </div>
            {boardLoading ? (
              <h1 className="mt-2 text-3xl font-black uppercase opacity-60">Chargement…</h1>
            ) : (
              <h1 className="mt-2 truncate text-3xl font-black uppercase">{board?.name ?? `Board #${boardId}`}</h1>
            )}
            {board?.description && (
              <p className="mt-2 max-w-xl text-sm text-gray-100/80">{board.description}</p>
            )}
          </div>

          <div className="flex flex-col items-end gap-3">
            <button
              onClick={() => togglePanel("members")}
              className="flex items-center gap-1 group"
              title="Voir / gérer les membres"
            >
              {members.slice(0, 6).map(m => (
                <div
                  key={m.id}
                  title={`${m.user_details?.username ?? `#${m.user}`} — ${m.role}`}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-yellow-400 text-xs font-black text-black transition group-hover:scale-105"
                >
                  {(m.user_details?.username ?? "?").substring(0, 2).toUpperCase()}
                </div>
              ))}
              {members.length > 6 && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-black/40 text-xs font-bold text-white">
                  +{members.length - 6}
                </div>
              )}
            </button>

            <div className="flex flex-wrap items-center justify-end gap-2">
              {board?.visibility && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold capitalize text-white">
                  {board.visibility}
                </span>
              )}
              <ActionButton
                active={activePanel === "invite"}
                onClick={() => {
                  if (!isAdmin) { toast("Seul un admin peut inviter des membres.", "error"); return; }
                  togglePanel("invite");
                }}
              >
                <UserPlus size={14} className="inline mr-1.5" />Inviter
              </ActionButton>
              <ActionButton active={activePanel === "members"} onClick={() => togglePanel("members")}>
                <Users size={14} className="inline mr-1.5" />{members.length} membre{members.length !== 1 ? "s" : ""}
              </ActionButton>
              {isAdmin && (
                board?.is_closed ? (
                  <ActionButton onClick={handleReopenBoard}><LockOpen size={14} className="inline mr-1.5" />Rouvrir</ActionButton>
                ) : (
                  <ActionButton onClick={handleCloseBoard} danger><Lock size={14} className="inline mr-1.5" />Fermer</ActionButton>
                )
              )}
            </div>
          </div>
        </div>

        {boardError && (
          <p className="mt-3 rounded-xl bg-red-500/20 p-2 text-sm text-red-200">{boardError}</p>
        )}

        {/* ── Panel : Invitation ─────────────────────── */}
        {activePanel === "invite" && isAdmin && (
          <form onSubmit={handleInvite} className="mt-5 flex flex-wrap items-end gap-3 rounded-2xl bg-black/30 p-5 backdrop-blur-sm">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-yellow-200">Adresse e-mail</label>
              <input
                type="email" required
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="collaborateur@example.com"
                className="rounded-xl border-2 border-yellow-400 bg-white px-3 py-2 text-sm text-black focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-yellow-200">Rôle</label>
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value as "member" | "observer")}
                className="rounded-xl border-2 border-yellow-400 bg-white px-3 py-2 text-sm text-black focus:outline-none"
              >
                <option value="member">Membre</option>
                <option value="observer">Observateur</option>
              </select>
            </div>
            <button
              type="submit" disabled={inviteLoading}
              className="rounded-xl bg-yellow-400 px-5 py-2 text-sm font-bold text-black hover:bg-orange-500 disabled:opacity-50"
            >
              {inviteLoading ? "Envoi…" : "Envoyer l'invitation"}
            </button>
            {inviteMsg   && <p className="text-sm text-green-300">{inviteMsg}</p>}
            {inviteError && <p className="text-sm text-red-300">{inviteError}</p>}
          </form>
        )}

        {/* ── Panel : Gestion membres ────────────────── */}
        {activePanel === "members" && isAdmin && (
          <div className="mt-5 rounded-2xl bg-black/30 p-5 backdrop-blur-sm">
            <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-yellow-200">
              Membres du tableau ({members.length})
            </h3>
            {memberError && (
              <p className="mb-3 rounded-xl bg-red-500/20 p-2 text-sm text-red-200">{memberError}</p>
            )}
            <div className="flex flex-col gap-2">
              {members.map(m => {
                const isMe = m.user_details?.user_id === user?.user_id;
                return (
                  <div key={m.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 text-sm font-black text-black">
                      {(m.user_details?.username ?? "?").substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-bold text-white">
                        {m.user_details?.username ?? `Membre #${m.user}`}
                        {isMe && <span className="ml-2 text-xs font-normal text-yellow-300">(vous)</span>}
                      </p>
                      <p className="text-xs text-gray-300">{m.user_details?.email ?? ""}</p>
                    </div>
                    {m.joined_at && (
                      <p className="hidden text-xs text-gray-400 sm:block">
                        depuis {new Date(m.joined_at).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })}
                      </p>
                    )}
                    {!isMe && (
                      <select
                        value={m.role ?? "member"}
                        disabled={roleUpdating === m.id}
                        onChange={e => handleChangeRole(m.id!, e.target.value as BoardMember.role)}
                        className="rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white focus:border-yellow-400 focus:outline-none"
                      >
                        <option value="admin" className="text-black">Admin</option>
                        <option value="member" className="text-black">Membre</option>
                        <option value="observer" className="text-black">Observateur</option>
                      </select>
                    )}
                    {isMe && (
                      <span className="rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-bold capitalize text-yellow-200">
                        {m.role}
                      </span>
                    )}
                    {!isMe && (
                      <button
                        onClick={() => handleRemoveMember(m.id!)}
                        disabled={removing === m.id}
                        className="rounded-xl border border-red-400/30 px-3 py-1.5 text-sm font-bold text-red-300 hover:border-red-400 hover:bg-red-500/20 disabled:opacity-50"
                      >
                        {removing === m.id ? "…" : "Retirer"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ── Kanban DnD ──────────────────────────────────────────── */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {listsLoading && (
            <div className="flex items-center gap-3 text-gray-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-yellow-500" />
              Chargement des listes…
            </div>
          )}
          {listsError && (
            <div className="rounded-xl bg-red-100 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{listsError}</div>
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

          {/* Ajouter une liste */}
          <div className="flex h-fit min-w-72 flex-shrink-0 flex-col gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-card">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)]">Nouvelle liste</p>
            <input
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
              }}
              placeholder="Nom de la liste…"
              className="rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-brand-500 focus:outline-none transition"
            />
            <Button
              onClick={() => createList(newListName).then(ok => {
                if (ok) { setNewListName(""); toast("Liste créée.", "success"); }
                else toast("Impossible de créer la liste.", "error");
              })}
              disabled={listsLoading || !newListName.trim()}
            >
              + Ajouter
            </Button>
          </div>
        </div>

        {/* ── Drag overlay ────────────────────────────────────── */}
        <DragOverlay>
          {activeItem?.type === "card" && (
            <div className="w-72 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 shadow-2xl opacity-90 rotate-1">
              <p className="text-sm font-semibold text-[var(--ink)]">{activeItem.card.title}</p>
            </div>
          )}
          {activeItem?.type === "list" && (
            <div className="w-72 rounded-2xl border border-[var(--line)] bg-[var(--surface-3)] px-4 py-3 shadow-2xl opacity-90 rotate-1">
              <p className="text-sm font-bold text-[var(--ink)]">{activeItem.list.name}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function ActionButton({
  children, onClick, active = false, danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-4 py-1.5 text-sm font-bold backdrop-blur-sm transition ${
        active
          ? "border-yellow-400 bg-yellow-400 text-black"
          : danger
            ? "border-red-300/40 bg-red-900/50 text-red-200 hover:border-red-300 hover:bg-red-900/70"
            : "border-white/30 bg-black/50 text-white hover:bg-black/70"
      }`}
    >
      {children}
    </button>
  );
}
