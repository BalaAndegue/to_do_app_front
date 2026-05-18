"use client";

import { useEffect, useState } from "react";
import {
  LayoutList, UserPlus, LogOut, MessageCircle, Trash2,
  CheckSquare, Square, Zap, ChevronLeft, ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { ActivitiesService } from "@/lib/services/ActivitiesService";
import { Activity } from "@/lib/models/Activity";
import { normalizeApiError } from "@/lib/api/client";

const ACTION_ICONS: Record<string, LucideIcon> = {
  create_board:   LayoutList,
  join_board:     UserPlus,
  leave_board:    LogOut,
  add_comment:    MessageCircle,
  delete_comment: Trash2,
  check_item:     CheckSquare,
  uncheck_item:   Square,
};

const ACTION_LABELS: Record<string, string> = {
  create_board:   "Tableau cree",
  join_board:     "A rejoint",
  leave_board:    "A quitte",
  add_comment:    "Commentaire ajoute",
  delete_comment: "Commentaire supprime",
  check_item:     "Item coche",
  uncheck_item:   "Item decoche",
};

const ACTION_COLORS: Record<string, string> = {
  create_board:   "bg-brand-100 dark:bg-brand-700/20 text-brand-700 dark:text-brand-400",
  join_board:     "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
  leave_board:    "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400",
  add_comment:    "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400",
  delete_comment: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400",
  check_item:     "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400",
  uncheck_item:   "bg-slate-100 dark:bg-slate-700/40 text-slate-600 dark:text-slate-400",
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [page, setPage]             = useState(1);
  const [count, setCount]           = useState(0);
  const [hasNext, setHasNext]       = useState(false);
  const [boardFilter, setBoardFilter] = useState("");
  const [cardFilter, setCardFilter]   = useState("");

  const fetchActivities = async (p = 1, board?: number, card?: number) => {
    setLoading(true); setError(null);
    try {
      const data = await ActivitiesService.activitiesList({ page: p, board: board || undefined, card: card || undefined });
      setActivities(data.results);
      setCount(data.count);
      setHasNext(!!data.next);
    } catch (err) { setError(normalizeApiError(err)); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchActivities(1); }, []);

  const handleFilter = (e: { preventDefault(): void }) => {
    e.preventDefault();
    const board = boardFilter ? Number(boardFilter) : undefined;
    const card  = cardFilter  ? Number(cardFilter)  : undefined;
    setPage(1);
    fetchActivities(1, board, card);
  };

  const handlePage = (next: boolean) => {
    const newPage = next ? page + 1 : page - 1;
    setPage(newPage);
    fetchActivities(newPage, boardFilter ? Number(boardFilter) : undefined, cardFilter ? Number(cardFilter) : undefined);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">Journal</p>
        <h1 className="mt-1 text-4xl font-black uppercase text-[var(--ink)]">Activites</h1>
        <p className="mt-2 text-[var(--ink-2)]">Toutes les actions sur vos tableaux, triees du plus recent au plus ancien.</p>
      </header>

      {/* Filters */}
      <form
        onSubmit={handleFilter}
        className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-card"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[var(--ink-2)]">Board ID</label>
          <input
            type="number" min="1" value={boardFilter}
            onChange={e => setBoardFilter(e.target.value)}
            placeholder="ex: 3"
            className="w-28 rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-brand-500 focus:outline-none transition"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[var(--ink-2)]">Carte ID</label>
          <input
            type="number" min="1" value={cardFilter}
            onChange={e => setCardFilter(e.target.value)}
            placeholder="ex: 12"
            className="w-28 rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-brand-500 focus:outline-none transition"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600"
        >
          Filtrer
        </button>
        {(boardFilter || cardFilter) && (
          <button
            type="button"
            onClick={() => { setBoardFilter(""); setCardFilter(""); setPage(1); fetchActivities(1); }}
            className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm font-bold text-[var(--ink-2)] transition hover:bg-[var(--surface-3)]"
          >
            Reinitialiser
          </button>
        )}
        <span className="ml-auto self-center text-xs text-[var(--ink-3)]">{count} resultat(s)</span>
      </form>

      {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</p>}

      {/* Skeleton */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <div className="shimmer h-10 w-10 flex-shrink-0 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="shimmer h-4 w-2/3 rounded-lg" />
                <div className="shimmer h-3 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && activities.length === 0 && (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-10 text-center text-[var(--ink-3)]">
          Aucune activite pour le moment.
        </div>
      )}

      {/* Activity list */}
      {!loading && (
        <div className="flex flex-col gap-3">
          {activities.map(activity => {
            const Icon      = ACTION_ICONS[activity.action_type] ?? Zap;
            const colorCls  = ACTION_COLORS[activity.action_type] ?? "bg-slate-100 dark:bg-slate-700/40 text-slate-600";
            const labelCls  = "rounded-full px-2 py-0.5 text-xs font-semibold " + colorCls;
            return (
              <div
                key={activity.activity_id}
                className="flex gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-card transition hover:shadow-card-lg"
              >
                {/* Icon */}
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${colorCls}`}>
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-black text-white">
                        {(activity.user_details?.username ?? "?").substring(0, 2).toUpperCase()}
                      </span>
                      <span className="text-sm font-bold text-[var(--ink)]">
                        {activity.user_details?.username ?? `Utilisateur #${activity.user}`}
                      </span>
                      <span className={labelCls}>
                        {ACTION_LABELS[activity.action_type] ?? activity.action_type}
                      </span>
                    </div>
                    <time className="text-xs text-[var(--ink-3)]">
                      {activity.created_at
                        ? new Date(activity.created_at).toLocaleDateString("fr-FR", {
                            day: "2-digit", month: "short", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })
                        : "—"}
                    </time>
                  </div>
                  {activity.content && (
                    <p className="mt-1.5 text-sm text-[var(--ink-2)]">{activity.content}</p>
                  )}
                  <div className="mt-1 flex gap-3 text-xs text-[var(--ink-3)]">
                    <span>Board #{activity.board}</span>
                    {activity.card && <span>Carte #{activity.card}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {(page > 1 || hasNext) && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => handlePage(false)} disabled={page <= 1}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--line)] px-4 py-2 text-sm font-bold text-[var(--ink-2)] transition hover:bg-[var(--surface-3)] disabled:opacity-40"
          >
            <ChevronLeft size={16} /> Precedent
          </button>
          <span className="rounded-full border border-[var(--line)] bg-[var(--surface-3)] px-4 py-2 text-sm text-[var(--ink-2)]">
            Page {page}
          </span>
          <button
            onClick={() => handlePage(true)} disabled={!hasNext}
            className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-40"
          >
            Suivant <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
