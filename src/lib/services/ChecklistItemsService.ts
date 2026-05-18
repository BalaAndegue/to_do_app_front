import type { ChecklistItem } from '../models/ChecklistItem';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type PaginatedChecklistItems = { count: number; next: string | null; previous: string | null; results: ChecklistItem[] };

export class ChecklistItemsService {
    public static checklistItemsList(params?: { checklist?: number; page?: number }): CancelablePromise<PaginatedChecklistItems> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checklist-items/',
            query: params,
        });
    }

    public static checklistItemsCreate(data: ChecklistItem): CancelablePromise<ChecklistItem> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/checklist-items/',
            body: data,
        });
    }

    public static checklistItemsRead(itemId: number): CancelablePromise<ChecklistItem> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checklist-items/{item_id}/',
            path: { item_id: itemId },
        });
    }

    public static checklistItemsUpdate(itemId: number, data: ChecklistItem): CancelablePromise<ChecklistItem> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/checklist-items/{item_id}/',
            path: { item_id: itemId },
            body: data,
        });
    }

    public static checklistItemsPartialUpdate(itemId: number, data: Partial<ChecklistItem>): CancelablePromise<ChecklistItem> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/checklist-items/{item_id}/',
            path: { item_id: itemId },
            body: data,
        });
    }

    public static checklistItemsDelete(itemId: number): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/checklist-items/{item_id}/',
            path: { item_id: itemId },
        });
    }
}
