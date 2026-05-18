import type { BoardMember } from '../models/BoardMember';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type PaginatedBoardMembers = { count: number; next: string | null; previous: string | null; results: BoardMember[] };

export class BoardMembersService {
    public static boardMembersList(params?: { page?: number }): CancelablePromise<PaginatedBoardMembers> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/board-members/',
            query: params,
        });
    }

    public static boardMembersCreate(data: BoardMember): CancelablePromise<BoardMember> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/board-members/',
            body: data,
        });
    }

    public static boardMembersRead(id: string): CancelablePromise<BoardMember> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/board-members/{id}/',
            path: { id },
        });
    }

    public static boardMembersPartialUpdate(id: string, data: Partial<BoardMember>): CancelablePromise<BoardMember> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/board-members/{id}/',
            path: { id },
            body: data,
        });
    }

    public static boardMembersDelete(id: string): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/board-members/{id}/',
            path: { id },
        });
    }
}
