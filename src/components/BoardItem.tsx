import Link from "next/link";
import { Board } from "@/lib";

interface BoardItemProps {
  board: Board;
}

export default function BoardItem({ board }: BoardItemProps) {
  return (
    <Link href={`/board/${board.board_id}`}>
      <div className="ibm-card p-6 cursor-pointer h-full min-h-[120px] flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#161616] mb-2">{board.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            Click to view and manage tasks in this workspace.
          </p>
        </div>
        <div className="text-xs text-[#0f62fe] font-medium mt-4 uppercase tracking-wider">
          View board →
        </div>
      </div>
    </Link>
  );
}
