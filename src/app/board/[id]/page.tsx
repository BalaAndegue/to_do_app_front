"use client";

import ListColumn from "@/components/ListColumn";
import { useEffect, useState, use } from "react";
import { BoardsService, ListsService, CardsService, type Board, type List, type Card } from "@/lib";

interface BoardPageProps {
  params: Promise<{ id: string }>;
}

export default function BoardPage({ params }: BoardPageProps) {
  const { id } = use(params);
  const boardId = parseInt(id);

  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resBoard, resLists, resCards] = await Promise.all([
          BoardsService.boardsRead(boardId),
          ListsService.listsList(),
          CardsService.cardsList()
        ]);

        const boardData: Board = (resBoard as any)?.data || resBoard;
        const allLists: List[] = (resLists as any)?.data || resLists;
        const allCards: Card[] = (resCards as any)?.data || resCards;

        setBoard(boardData);
        // Filter lists and cards for this specific board
        if (Array.isArray(allLists)) {
          setLists(allLists.filter(l => l.board === boardId).sort((a, b) => a.position - b.position));
        }
        if (Array.isArray(allCards)) {
          setCards(allCards.filter(c => c.board === boardId));
        }
      } catch (error) {
        console.error("Error fetching board data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [boardId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-10 w-48 bg-gray-200" />
        <div className="flex gap-6 overflow-x-auto pb-4">
          {[1, 2, 3].map(i => <div key={i} className="min-w-[300px] h-[500px] bg-gray-200" />)}
        </div>
      </div>
    );
  }

  if (!board) {
    return <div className="text-red-600">Board not found or access denied.</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <header className="mb-8 flex items-end justify-between border-b border-[#e0e0e0] pb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#161616] tracking-tight">{board.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Workspace ID: {board.board_id}</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-[#e0e0e0] px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
            Share
          </button>
          <button className="bg-[#0f62fe] text-white px-4 py-2 text-sm hover:bg-[#0353e9] transition-colors">
            Settings
          </button>
        </div>
      </header>

      <main className="flex-1 flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300">
        {lists.map(list => (
          <ListColumn
            key={list.list_id}
            list={list}
            cards={cards.filter(c => c.list === list.list_id).sort((a, b) => a.position - b.position)}
          />
        ))}
        <button className="min-w-[300px] h-fit p-4 border-2 border-dashed border-[#e0e0e0] hover:border-[#0f62fe] text-gray-500 hover:text-[#0f62fe] transition-all text-left font-medium">
          + Add another list
        </button>
      </main>
    </div>
  );
}
