import { Board } from "@/lib";

export default function BoardItem({ board }: { board: Board }) {
  const bg =
    board.background_type === "color"
      ? { backgroundColor: board.background_value }
      : board.background_type === "image"
        ? {
            backgroundImage: `linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)),url(${board.background_value})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
        : { background: "linear-gradient(135deg,#1e3a5f,#0f2040)" };

  return (
    <a
      href={`/board/${board.board_id}`}
      className="group block overflow-hidden rounded-2xl border border-[var(--line)] shadow-card transition hover:shadow-card-lg"
    >
      {/* Cover */}
      <div className="flex h-20 items-end p-3" style={bg}>
        <span className="truncate text-sm font-black text-white drop-shadow">
          {board.name}
        </span>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between bg-[var(--surface)] px-3 py-2">
        {board.description ? (
          <p className="truncate text-xs text-[var(--ink-2)]">{board.description}</p>
        ) : (
          <span className="text-xs italic text-[var(--ink-3)]">Aucune description</span>
        )}
        {board.is_closed && (
          <span className="ml-2 flex-shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
            Archivé
          </span>
        )}
      </div>
    </a>
  );
}
