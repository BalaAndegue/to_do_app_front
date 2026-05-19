"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Users, Archive, RotateCcw, ExternalLink } from "lucide-react";
import { BoardsService } from "@/lib/services/BoardsService";
import { Board } from "@/lib/models/Board";
import { normalizeApiError } from "@/lib/api/client";
import { useAuth } from "@/components/AuthContext";
import Tooltip from "@/components/Tooltip";

const VIS_LABEL: Record<string, string> = { public: "Public", private: "Prive", workspace: "Workspace" };
const VIS_COLOR: Record<string, string> = {
  public:    "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
  private:   "bg-slate-100  text-slate-600  dark:bg-slate-700/40  dark:text-slate-400",
  workspace: "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400",
};

export default function SpacesPage() {
  const { isAuthenticated } = useAuth();
  const [boards, setBoards]       = useState<Board[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [showClosed, setShowClosed] = useState(false);
  const [visFilter, setVisFilter] = useState<"" | "public" | "private" | "workspace">("");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", visibility: "private", background_type: "color", background_value: "#1e3a5f" });
  const [creating, setCreating]   = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchBoards = async () => {
    setLoading(true); setError(null);
    try {
      const data = await BoardsService.boardsList({
        is_closed: showClosed || undefined,
        visibility: visFilter || undefined,
      });
      setBoards(data.results);
    } catch (err) { setError(normalizeApiError(err)); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBoards(); }, [showClosed, visFilter]);

  const handleCreate = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setCreating(true); setCreateError(null);
    try {
      const board = await BoardsService.boardsCreate({
        name: form.name.trim(), description: form.description.trim() || undefined,
        visibility: form.visibility as Board.visibility,
        background_type: form.background_type, background_value: form.background_value, position: 0,
      });
      setBoards(prev => [board, ...prev]);
      setShowCreate(false);
      setForm({ name: "", description: "", visibility: "private", background_type: "color", background_value: "#1e3a5f" });
    } catch (err) { setCreateError(normalizeApiError(err)); }
    finally { setCreating(false); }
  };

  const handleClose = async (boardId: number, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    try {
      await BoardsService.boardsClose(String(boardId));
      setBoards(prev => prev.map(b => b.board_id === boardId ? { ...b, is_closed: true } : b));
    } catch (err) { setError(normalizeApiError(err)); }
  };

  const handleReopen = async (boardId: number, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    try {
      await BoardsService.boardsReopen(String(boardId));
      setBoards(prev => prev.map(b => b.board_id === boardId ? { ...b, is_closed: false } : b));
    } catch (err) { setError(normalizeApiError(err)); }
  };

  const activeBoards  = boards.filter(b => !b.is_closed);
  const closedBoards  = boards.filter(b =>  b.is_closed);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">Workspace</p>
          <h1 className="mt-1 text-4xl font-black uppercase text-[var(--ink)]">Mes tableaux</h1>
          <p className="mt-2 text-[var(--ink-2)]">Tous vos projets Kanban — listes, cartes, membres et activites.</p>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => setShowCreate(v => !v)}
            className="flex items-center gap-2 rounded-2xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-600 hover:shadow-md active:scale-95"
          >
            <Plus size={16} /> Nouveau tableau
          </button>
        )}
      </div>

      {/* Create form */}
      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mb-8 animate-scale-in rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-card"
        >
          <h2 className="mb-4 text-base font-black uppercase text-[var(--ink)]">Creer un tableau</h2>
          {createError && (
            <p className="mb-3 rounded-xl border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {createError}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--ink-2)]">Nom *</label>
              <input
                required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Mon projet…"
                className="rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-brand-500 focus:outline-none transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--ink-2)]">Visibilite</label>
              <select
                value={form.visibility}
                onChange={e => setForm(f => ({ ...f, visibility: e.target.value }))}
                className="rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] focus:border-brand-500 focus:outline-none transition"
              >
                <option value="private">Prive</option>
                <option value="public">Public</option>
                <option value="workspace">Workspace</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--ink-2)]">Description</label>
              <input
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Description optionnelle…"
                className="rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-brand-500 focus:outline-none transition"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--ink-2)]">Fond</label>
              <div className="flex gap-2">
                <select
                  value={form.background_type}
                  onChange={e => setForm(f => ({ ...f, background_type: e.target.value }))}
                  className="rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] focus:border-brand-500 focus:outline-none transition"
                >
                  <option value="color">Couleur</option>
                  <option value="image">Image URL</option>
                </select>
                {form.background_type === "color" && (
                  <input
                    type="color"
                    value={form.background_value.startsWith("#") ? form.background_value : "#1e3a5f"}
                    onChange={e => setForm(f => ({ ...f, background_value: e.target.value }))}
                    className="h-10 w-10 shrink-0 cursor-pointer rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] p-0.5"
                    title="Choisir une couleur"
                  />
                )}
                <input
                  value={form.background_value}
                  onChange={e => setForm(f => ({ ...f, background_value: e.target.value }))}
                  placeholder={form.background_type === "color" ? "#1e3a5f" : "https://…"}
                  className="flex-1 rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-brand-500 focus:outline-none transition"
                />
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <button
              type="submit" disabled={creating}
              className="rounded-xl bg-brand-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-50"
            >
              {creating ? "Creation…" : "Creer le tableau"}
            </button>
            <button
              type="button" onClick={() => setShowCreate(false)}
              className="rounded-xl border border-[var(--line)] px-5 py-2 text-sm font-bold text-[var(--ink-2)] transition hover:bg-[var(--surface-3)]"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-sm font-bold text-[var(--ink-3)]">Filtrer :</span>
        {(["", "public", "private", "workspace"] as const).map(v => (
          <button
            key={v} onClick={() => setVisFilter(v)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              visFilter === v
                ? "bg-brand-500 text-white shadow-sm"
                : "border border-[var(--line)] bg-[var(--surface)] text-[var(--ink-2)] hover:border-brand-400 hover:text-[var(--ink)]"
            }`}
          >
            {v === "" ? "Tous" : VIS_LABEL[v]}
          </button>
        ))}
        <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm text-[var(--ink-2)]">
          <input
            type="checkbox" checked={showClosed}
            onChange={e => setShowClosed(e.target.checked)}
            className="accent-brand-500"
          />
          Afficher archives
        </label>
      </div>

      {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</p>}

      {/* Skeleton */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <BoardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && activeBoards.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-[var(--line)] bg-[var(--surface)] py-16 text-center">
          <p className="text-2xl font-black text-[var(--ink-3)]">Aucun tableau actif</p>
          <p className="mt-2 text-sm text-[var(--ink-3)]">Creez votre premier tableau pour commencer.</p>
          {isAuthenticated && (
            <button
              onClick={() => setShowCreate(true)}
              className="mt-4 rounded-xl bg-brand-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-600"
            >
              + Creer un tableau
            </button>
          )}
        </div>
      )}

      {/* Active boards */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeBoards.map(board => (
            <BoardCard key={board.board_id} board={board} onClose={handleClose} onReopen={handleReopen} />
          ))}
        </div>
      )}

      {/* Archived */}
      {closedBoards.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase text-[var(--ink-3)]">
            <span className="inline-block h-4 w-1 rounded-full bg-[var(--line-strong)]" />
            Archives ({closedBoards.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 opacity-70">
            {closedBoards.map(board => (
              <BoardCard key={board.board_id} board={board} onClose={handleClose} onReopen={handleReopen} archived />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── BoardCard ─────────────────────────────────────────────── */
function BoardCard({ board, onClose, onReopen, archived = false }: {
  board: Board;
  onClose: (id: number, e: React.MouseEvent) => void;
  onReopen: (id: number, e: React.MouseEvent) => void;
  archived?: boolean;
}) {
  const bgStyle = board.background_type === "color" && board.background_value
    ? { backgroundColor: board.background_value }
    : board.background_type === "image" && board.background_value
      ? { backgroundImage: `linear-gradient(rgba(0,0,0,.42),rgba(0,0,0,.42)),url(${board.background_value})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { background: "linear-gradient(135deg,#1e3a5f,#0f2040)" };

  return (
    <div className={`card-lift group flex flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-card ${archived ? "grayscale" : ""}`}>
      {/* Thumbnail */}
      <Link href={`/board/${board.board_id}`} className="block">
        <div className="relative h-36" style={bgStyle}>
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent p-4 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">{board.visibility ?? "private"}</p>
            <h3 className="mt-0.5 truncate text-lg font-black leading-tight">{board.name}</h3>
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {board.description && (
          <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[var(--ink-2)]">{board.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--ink-3)]">
          {board.visibility && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${VIS_COLOR[board.visibility]}`}>
              {VIS_LABEL[board.visibility]}
            </span>
          )}
          {board.members && board.members.length > 0 && (
            <div className="flex -space-x-2">
              {board.members.slice(0, 5).map(m => (
                <div
                  key={m.id}
                  title={m.user_details?.username ?? `#${m.user}`}
                  className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-brand-500 text-[9px] font-black text-white"
                >
                  {(m.user_details?.username ?? "?")[0].toUpperCase()}
                </div>
              ))}
              {board.members.length > 5 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--surface-3)] text-[9px] font-bold text-[var(--ink-3)]">
                  +{board.members.length - 5}
                </div>
              )}
            </div>
          )}
          {board.created_at && (
            <span className="ml-auto">
              {new Date(board.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-3 flex gap-2 border-t border-[var(--line)] pt-3">
          <Tooltip label="Ouvrir le tableau">
            <Link
              href={`/board/${board.board_id}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-500 py-2 text-center text-sm font-bold text-white transition hover:bg-brand-600"
            >
              <ExternalLink size={13} /> Ouvrir
            </Link>
          </Tooltip>
          {archived ? (
            <Tooltip label="Restaurer ce tableau">
              <button
                onClick={e => onReopen(board.board_id!, e)}
                className="flex items-center gap-1.5 rounded-xl border border-green-300 px-3 py-2 text-sm font-bold text-green-700 transition hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
              >
                <RotateCcw size={13} /> Restaurer
              </button>
            </Tooltip>
          ) : (
            <Tooltip label="Archiver ce tableau">
              <button
                onClick={e => onClose(board.board_id!, e)}
                className="flex items-center gap-1.5 rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-bold text-[var(--ink-2)] transition hover:border-orange-400 hover:text-orange-600"
              >
                <Archive size={13} /> Archiver
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton ─────────────────────────────────────────────── */
function BoardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
      <div className="shimmer h-36" />
      <div className="p-4">
        <div className="shimmer h-4 w-3/4 rounded-lg" />
        <div className="shimmer mt-2 h-3 w-1/2 rounded-lg" />
        <div className="mt-4 shimmer h-8 w-full rounded-xl" />
      </div>
    </div>
  );
}
