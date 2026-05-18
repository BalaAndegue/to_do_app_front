import { useCallback, useState } from "react";
import { BoardsService } from "../lib/services/BoardsService";
import { Board } from "../lib/models/Board";
import { normalizeApiError } from "@/lib/api/client";

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoards = useCallback(async (params?: { is_closed?: boolean; visibility?: 'public' | 'private' | 'workspace' }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await BoardsService.boardsList(params);
      setBoards(data.results);
    } catch (err: unknown) {
      setError(normalizeApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const createBoard = async (name: string, description?: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return null;
    setLoading(true);
    setError(null);
    try {
      const board = await BoardsService.boardsCreate({
        name: trimmedName,
        description: description?.trim() || undefined,
      });
      setBoards(prev => [...prev, board]);
      return board;
    } catch (err: unknown) {
      setError(normalizeApiError(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteBoard = async (boardId: number) => {
    try {
      await BoardsService.boardsDelete(String(boardId));
      setBoards(prev => prev.filter(b => b.board_id !== boardId));
    } catch (err: unknown) {
      setError(normalizeApiError(err));
    }
  };

  const closeBoard = async (boardId: number) => {
    try {
      await BoardsService.boardsClose(String(boardId));
      setBoards(prev => prev.map(b => b.board_id === boardId ? { ...b, is_closed: true } : b));
    } catch (err: unknown) {
      setError(normalizeApiError(err));
    }
  };

  const reopenBoard = async (boardId: number) => {
    try {
      await BoardsService.boardsReopen(String(boardId));
      setBoards(prev => prev.map(b => b.board_id === boardId ? { ...b, is_closed: false } : b));
    } catch (err: unknown) {
      setError(normalizeApiError(err));
    }
  };

  return { boards, fetchBoards, loading, error, createBoard, deleteBoard, closeBoard, reopenBoard };
}
