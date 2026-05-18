import type { CardMember } from '../models/CardMember';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type PaginatedCardMembers = { count: number; next: string | null; previous: string | null; results: CardMember[] };

export class CardMembersService {
    public static cardMembersList(params?: { card?: number; page?: number }): CancelablePromise<PaginatedCardMembers> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/card-members/',
            query: params,
        });
    }

    public static cardMembersCreate(data: CardMember): CancelablePromise<CardMember> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/card-members/',
            body: data,
        });
    }

    public static cardMembersDelete(id: number): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/card-members/{id}/',
            path: { id },
        });
    }
}
