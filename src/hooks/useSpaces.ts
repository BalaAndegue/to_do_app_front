"use client";

import { useCallback, useMemo, useState } from "react";

export type Workspace = {
  id: string;
  name: string;
  description?: string;
  boardIds: number[];
  createdAt: string;
};

const STORAGE_KEY = "trello_like_spaces_v1";

const readSpaces = (): Workspace[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as Workspace[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
};

const writeSpaces = (spaces: Workspace[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(spaces));
};

const createWorkspaceId = (): string => {
  return `space-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export function useSpaces() {
  const [spaces, setSpaces] = useState<Workspace[]>(readSpaces);

  const saveSpaces = useCallback((nextSpaces: Workspace[]) => {
    setSpaces(nextSpaces);
    writeSpaces(nextSpaces);
  }, []);

  const createSpace = useCallback((name: string, description?: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return null;
    }

    const newSpace: Workspace = {
      id: createWorkspaceId(),
      name: trimmedName,
      description: description?.trim() || undefined,
      boardIds: [],
      createdAt: new Date().toISOString(),
    };

    saveSpaces([newSpace, ...spaces]);
    return newSpace;
  }, [saveSpaces, spaces]);

  const assignBoardToSpace = useCallback((spaceId: string, boardId: number) => {
    const nextSpaces = spaces.map((space) => {
      if (space.id !== spaceId) {
        return space;
      }

      if (space.boardIds.includes(boardId)) {
        return space;
      }

      return {
        ...space,
        boardIds: [...space.boardIds, boardId],
      };
    });

    saveSpaces(nextSpaces);
  }, [saveSpaces, spaces]);

  const removeBoardFromSpace = useCallback((spaceId: string, boardId: number) => {
    const nextSpaces = spaces.map((space) => {
      if (space.id !== spaceId) {
        return space;
      }

      return {
        ...space,
        boardIds: space.boardIds.filter((id) => id !== boardId),
      };
    });

    saveSpaces(nextSpaces);
  }, [saveSpaces, spaces]);

  const getSpaceById = useCallback((id: string) => {
    return spaces.find((space) => space.id === id) ?? null;
  }, [spaces]);

  const sortedSpaces = useMemo(() => {
    return [...spaces].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [spaces]);

  return {
    spaces: sortedSpaces,
    createSpace,
    assignBoardToSpace,
    removeBoardFromSpace,
    getSpaceById,
  };
}
