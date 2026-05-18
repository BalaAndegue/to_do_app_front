"use client";
import React from "react";
import Link from "next/link";
import Card from "./Card";
import { Board } from "../../lib/models/Board";
import { uiImages } from "@/lib/ui-images";

export default function BoardItem({ board }: { board: Board }) {
  return (
    <Link href={`/board/${board.board_id}`} className="block">
      <Card className="mb-2 cursor-pointer overflow-hidden border border-gray-200 p-0 transition hover:shadow-lg">
        <div
          className="h-28 bg-cover bg-center"
          style={{ backgroundImage: `url(${uiImages.boardHeader})` }}
        />
        <div className="p-4">
        <div className="font-bold text-lg mb-1 text-black">{board.name}</div>
        {board.description && <div className="text-sm text-gray-500">{board.description}</div>}
        </div>
      </Card>
    </Link>
  );
}
