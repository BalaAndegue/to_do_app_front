import { useCallback, useState } from "react";
import { CardsService } from "../lib/services/CardsService";
import { Card } from "../lib/models/Card";
import { normalizeApiError } from "@/lib/api/client";

export function useCards(listId: number) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CardsService.cardsList({ list: listId, archived: false });
      setCards(data.results);
    } catch (err: unknown) {
      setError(normalizeApiError(err));
    } finally {
      setLoading(false);
    }
  }, [listId]);

  const createCard = async (title: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return false;
    setLoading(true);
    setError(null);
    try {
      const card = await CardsService.cardsCreate({
        title: trimmedTitle,
        list: listId,
        position: cards.length,
      });
      setCards(prev => [...prev, card]);
      return true;
    } catch (err: unknown) {
      setError(normalizeApiError(err));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCard = async (cardId: number, data: Partial<Card>) => {
    try {
      const updated = await CardsService.cardsPartialUpdate(String(cardId), data);
      setCards(prev => prev.map(c => c.card_id === cardId ? updated : c));
      return updated;
    } catch (err: unknown) {
      setError(normalizeApiError(err));
      return null;
    }
  };

  const deleteCard = async (cardId: number) => {
    try {
      await CardsService.cardsDelete(String(cardId));
      setCards(prev => prev.filter(c => c.card_id !== cardId));
    } catch (err: unknown) {
      setError(normalizeApiError(err));
    }
  };

  const archiveCard = async (cardId: number) => {
    try {
      await CardsService.cardsArchive(String(cardId));
      setCards(prev => prev.filter(c => c.card_id !== cardId));
    } catch (err: unknown) {
      setError(normalizeApiError(err));
    }
  };

  const moveCard = async (cardId: number, targetListId: number, position: number) => {
    try {
      const updated = await CardsService.cardsMove(String(cardId), { position, list_id: targetListId });
      if (targetListId !== listId) {
        setCards(prev => prev.filter(c => c.card_id !== cardId));
      } else {
        setCards(prev => prev.map(c => c.card_id === cardId ? updated : c));
      }
    } catch (err: unknown) {
      setError(normalizeApiError(err));
    }
  };

  return { cards, fetchCards, loading, error, createCard, updateCard, deleteCard, archiveCard, moveCard };
}
