"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BoardItem from "@/components/ui/BoardItem";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useBoards } from "@/hooks/useBoards";
import { useSpaces } from "@/hooks/useSpaces";
import { uiImages } from "@/lib/ui-images";

export default function SpaceDetailsPage() {
  const params = useParams<{ id: string }>();
  const spaceId = params.id;
  const { boards, fetchBoards, loading, error, createBoard } = useBoards();
  const { getSpaceById, assignBoardToSpace, removeBoardFromSpace } = useSpaces();
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const space = getSpaceById(spaceId);

  const spaceBoards = useMemo(() => {
    if (!space) {
      return [];
    }

    return boards.filter((board) => {
      if (!board.board_id) {
        return false;
      }
      return space.boardIds.includes(board.board_id);
    });
  }, [boards, space]);

  const handleCreateBoard = async () => {
    const payloadName = newBoardName.trim();
    if (!payloadName || !space) {
      return;
    }

    const board = await createBoard(payloadName, newBoardDescription.trim());
    if (board?.board_id) {
      assignBoardToSpace(space.id, board.board_id);
      setNewBoardName("");
      setNewBoardDescription("");
    }
  };

  if (!space) {
    return (
      <Card className="mx-auto max-w-3xl">
        <p className="text-lg font-bold">Espace introuvable</p>
        <p className="mt-2 text-gray-600">Cet espace n'existe pas (ou plus) dans ton navigateur.</p>
        <Link href="/spaces" className="mt-4 inline-block font-semibold text-yellow-700 underline">
          Retour aux espaces
        </Link>
      </Card>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10">
      <header className="grid gap-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-yellow-700">Espace</p>
          <h1 className="text-3xl font-black uppercase text-black md:text-4xl">{space.name}</h1>
          <p className="text-gray-600">{space.description || "Aucune description"}</p>
        </div>
        <div
          className="min-h-44 rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,.25)), url(${uiImages.spaceCard2})` }}
        />
      </header>

      <Card className="flex flex-col gap-3 border border-gray-200">
        <h2 className="text-xl font-black uppercase">Nouveau tableau</h2>
        <input
          type="text"
          value={newBoardName}
          onChange={(event) => setNewBoardName(event.target.value)}
          placeholder="Nom du tableau"
          className="rounded-xl border-2 border-yellow-400 px-3 py-2 focus:border-yellow-500 focus:outline-none"
        />
        <textarea
          value={newBoardDescription}
          onChange={(event) => setNewBoardDescription(event.target.value)}
          placeholder="Description (optionnel)"
          className="min-h-24 rounded-xl border-2 border-yellow-400 px-3 py-2 focus:border-yellow-500 focus:outline-none"
        />
        <Button className="w-fit" disabled={loading} onClick={handleCreateBoard}>
          + Creer le tableau
        </Button>
      </Card>

      {error && <p className="text-red-600">{error}</p>}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {spaceBoards.length === 0 && (
          <Card>
            Aucun tableau dans cet espace. Cree ton premier tableau pour commencer a gerer tes cartes.
          </Card>
        )}
        {spaceBoards.map((board) => (
          <div key={board.board_id} className="relative">
            <BoardItem board={board} />
            {board.board_id && (
              <button
                type="button"
                onClick={() => removeBoardFromSpace(space.id, board.board_id!)}
                className="absolute right-4 top-4 rounded-lg border border-red-300 bg-white px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Retirer
              </button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}
