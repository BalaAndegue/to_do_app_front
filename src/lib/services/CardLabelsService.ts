import type { CardLabel } from '../models/CardLabel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type PaginatedCardLabels = { count: number; next: string | null; previous: string | null; results: CardLabel[] };

export class CardLabelsService {
    public static cardLabelsList(params?: { card?: number; page?: number }): CancelablePromise<PaginatedCardLabels> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/card-labels/',
            query: params,
        });
    }

    public static cardLabelsCreate(data: CardLabel): CancelablePromise<CardLabel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/card-labels/',
            body: data,
        });
    }

    public static cardLabelsDelete(id: number): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/card-labels/{id}/',
            path: { id },
        });
    }
}
