import type { Checklist } from '../models/Checklist';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type PaginatedChecklists = { count: number; next: string | null; previous: string | null; results: Checklist[] };

export class ChecklistsService {
    public static checklistsList(params?: { card?: number; page?: number }): CancelablePromise<PaginatedChecklists> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checklists/',
            query: params,
        });
    }

    public static checklistsCreate(data: Checklist): CancelablePromise<Checklist> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/checklists/',
            body: data,
        });
    }

    public static checklistsRead(checklistId: number): CancelablePromise<Checklist> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checklists/{checklist_id}/',
            path: { checklist_id: checklistId },
        });
    }

    public static checklistsUpdate(checklistId: number, data: Checklist): CancelablePromise<Checklist> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/checklists/{checklist_id}/',
            path: { checklist_id: checklistId },
            body: data,
        });
    }

    public static checklistsPartialUpdate(checklistId: number, data: Partial<Checklist>): CancelablePromise<Checklist> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/checklists/{checklist_id}/',
            path: { checklist_id: checklistId },
            body: data,
        });
    }

    public static checklistsDelete(checklistId: number): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/checklists/{checklist_id}/',
            path: { checklist_id: checklistId },
        });
    }
}
