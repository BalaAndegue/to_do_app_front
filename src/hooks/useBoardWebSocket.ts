"use client";

import { useEffect, useRef } from "react";
import { AUTH_TOKEN_STORAGE_KEY } from "@/lib/api/client";
import type { Card } from "@/lib/models/Card";
import type { List } from "@/lib/models/List";

type WsEvent =
  | { type: "card_created" | "card_updated" | "card_moved"; data: Card }
  | { type: "card_deleted"; data: { card_id: number } }
  | { type: "list_created" | "list_updated" | "list_moved"; data: List }
  | { type: "list_deleted"; data: { list_id: number } };

interface Options {
  onCardCreated?: (card: Card) => void;
  onCardUpdated?: (card: Card) => void;
  onCardDeleted?: (cardId: number) => void;
  onCardMoved?: (card: Card) => void;
  onListCreated?: (list: List) => void;
  onListUpdated?: (list: List) => void;
  onListDeleted?: (listId: number) => void;
  onListMoved?: (list: List) => void;
  enabled?: boolean;
}

export function useBoardWebSocket(boardId: number, options: Options = {}) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (options.enabled === false || !boardId) return;

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
        : null;

    if (!token) return;

    const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://flowpilot-api.duckdns.org/api")
      .replace(/\/api\/?$/, "")
      .replace(/^https:/, "wss:")
      .replace(/^http:/, "ws:");

    const url = `${apiBase}/ws/boards/${boardId}/?token=${token}`;

    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;
    let closed = false;

    const connect = () => {
      ws = new WebSocket(url);

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string) as WsEvent;
          const {
            onCardCreated, onCardUpdated, onCardDeleted, onCardMoved,
            onListCreated, onListUpdated, onListDeleted, onListMoved,
          } = optionsRef.current;

          switch (msg.type) {
            case "card_created": onCardCreated?.(msg.data); break;
            case "card_updated": onCardUpdated?.(msg.data); break;
            case "card_deleted": onCardDeleted?.(msg.data.card_id); break;
            case "card_moved":   onCardMoved?.(msg.data); break;
            case "list_created": onListCreated?.(msg.data); break;
            case "list_updated": onListUpdated?.(msg.data); break;
            case "list_deleted": onListDeleted?.(msg.data.list_id); break;
            case "list_moved":   onListMoved?.(msg.data); break;
          }
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        if (!closed) {
          reconnectTimer = setTimeout(connect, 3000);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      closed = true;
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [boardId, options.enabled]);
}
