import type { Card } from '../models/Card';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type PaginatedCards = { count: number; next: string | null; previous: string | null; results: Card[] };

export class CardsService {
    public static cardsList(params?: {
        list?: number;
        board?: number;
        archived?: boolean;
        search?: string;
        page?: number;
    }): CancelablePromise<PaginatedCards> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cards/',
            query: params,
        });
    }

    public static cardsCreate(data: Card): CancelablePromise<Card> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cards/',
            body: data,
        });
    }

    public static cardsRead(cardId: string): CancelablePromise<Card> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cards/{card_id}/',
            path: { card_id: cardId },
        });
    }

    public static cardsUpdate(cardId: string, data: Card): CancelablePromise<Card> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/cards/{card_id}/',
            path: { card_id: cardId },
            body: data,
        });
    }

    public static cardsPartialUpdate(cardId: string, data: Partial<Card>): CancelablePromise<Card> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/cards/{card_id}/',
            path: { card_id: cardId },
            body: data,
        });
    }

    public static cardsDelete(cardId: string): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/cards/{card_id}/',
            path: { card_id: cardId },
        });
    }

    public static cardsArchive(cardId: string): CancelablePromise<Card> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cards/{card_id}/archive/',
            path: { card_id: cardId },
            body: {},
        });
    }

    public static cardsUnarchive(cardId: string): CancelablePromise<Card> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cards/{card_id}/unarchive/',
            path: { card_id: cardId },
            body: {},
        });
    }

    public static cardsMove(
        cardId: string,
        data: { position: number; list_id?: number },
    ): CancelablePromise<{ success: boolean; data: Card }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cards/{card_id}/move/',
            path: { card_id: cardId },
            body: data,
        });
    }

    public static cardsCopy(cardId: string): CancelablePromise<{ success: boolean; data: Card }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cards/{card_id}/copy/',
            path: { card_id: cardId },
            body: {},
        });
    }
}
