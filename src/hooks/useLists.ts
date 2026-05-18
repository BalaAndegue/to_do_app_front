import { useCallback, useState } from "react";
import { ListsService } from "../lib/services/ListsService";
import { List } from "../lib/models/List";
import { normalizeApiError } from "@/lib/api/client";

export function useLists(boardId: number) {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ListsService.listsList({ board: boardId, archived: false });
      setLists(data.results);
    } catch (err: unknown) {
      setError(normalizeApiError(err));
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  const createList = async (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return false;
    setLoading(true);
    setError(null);
    try {
      const list = await ListsService.listsCreate({
        name: trimmedName,
        board: boardId,
        position: lists.length,
      });
      setLists(prev => [...prev, list]);
      return true;
    } catch (err: unknown) {
      setError(normalizeApiError(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const renameList = async (listId: number, name: string) => {
    try {
      const updated = await ListsService.listsPartialUpdate(String(listId), { name });
      setLists(prev => prev.map(l => l.list_id === listId ? updated : l));
    } catch (err: unknown) {
      setError(normalizeApiError(err));
    }
  };

  const deleteList = async (listId: number) => {
    try {
      await ListsService.listsDelete(String(listId));
      setLists(prev => prev.filter(l => l.list_id !== listId));
    } catch (err: unknown) {
      setError(normalizeApiError(err));
    }
  };

  return { lists, fetchLists, loading, error, createList, renameList, deleteList };
}
