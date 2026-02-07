"use client";

import BoardItem from "./BoardItem";
import CreateBoardModal from "./CreateBoardModal";
import { useEffect, useState } from "react";
import { BoardsService, type Board } from "@/lib";

export default function BoardList() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    BoardsService.boardsList()
      .then((res: any) => {
        const boardsData = res?.data || res;
        setBoards(Array.isArray(boardsData) ? boardsData : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCreateSuccess = (newBoard: Board) => {
    setBoards([...boards, newBoard]);
  };

  if (loading) {
    return <div className="text-gray-500">Loading boards...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.length > 0 ? (
          boards.map(board => <BoardItem key={board.board_id} board={board} />)
        ) : (
          <div className="col-span-full py-12 border-2 border-dashed border-[#e0e0e0] flex flex-col items-center justify-center bg-white">
            <p className="text-gray-500 mb-4">No boards found.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0f62fe] hover:bg-[#0353e9] text-white px-4 py-2 transition-colors"
            >
              Create your first board
            </button>
          </div>
        )}
        {boards.length > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-full min-h-[140px] border-2 border-dashed border-[#e0e0e0] hover:border-[#0f62fe] hover:bg-white flex items-center justify-center transition-all group"
          >
            <span className="text-gray-500 group-hover:text-[#0f62fe] font-medium">+ New Board</span>
          </button>
        )}
      </div>

      <CreateBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
