import type { Board } from '../models/Board';
import type { BoardInvitation } from '../models/BoardInvitation';
import type { BoardMember } from '../models/BoardMember';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type PaginatedBoards = { count: number; next: string | null; previous: string | null; results: Board[] };

export class BoardsService {
    public static boardsList(params?: {
        is_closed?: boolean;
        visibility?: 'public' | 'private' | 'workspace';
        page?: number;
    }): CancelablePromise<PaginatedBoards> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/boards/',
            query: params,
        });
    }

    public static boardsCreate(data: Board): CancelablePromise<Board> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/boards/',
            body: data,
        });
    }

    public static boardsRead(boardId: string): CancelablePromise<Board> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/boards/{board_id}/',
            path: { board_id: boardId },
        });
    }

    public static boardsUpdate(boardId: string, data: Board): CancelablePromise<Board> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/boards/{board_id}/',
            path: { board_id: boardId },
            body: data,
        });
    }

    public static boardsPartialUpdate(boardId: string, data: Partial<Board>): CancelablePromise<Board> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/boards/{board_id}/',
            path: { board_id: boardId },
            body: data,
        });
    }

    public static boardsDelete(boardId: string): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/boards/{board_id}/',
            path: { board_id: boardId },
        });
    }

    public static boardsClose(boardId: string): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/boards/{board_id}/close/',
            path: { board_id: boardId },
            body: {},
        });
    }

    public static boardsReopen(boardId: string): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/boards/{board_id}/reopen/',
            path: { board_id: boardId },
            body: {},
        });
    }

    public static boardsInvite(
        boardId: string,
        data: { email: string; role?: 'member' | 'observer' },
    ): CancelablePromise<BoardInvitation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/boards/{board_id}/invite/',
            path: { board_id: boardId },
            body: data,
        });
    }

    public static boardsMembers(boardId: string): CancelablePromise<BoardMember[]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/boards/{board_id}/members/',
            path: { board_id: boardId },
        });
    }
}
