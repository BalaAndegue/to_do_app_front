import type { Label } from '../models/Label';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type PaginatedLabels = { count: number; next: string | null; previous: string | null; results: Label[] };

export class LabelsService {
    public static labelsList(params?: { board?: number; page?: number }): CancelablePromise<PaginatedLabels> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/labels/',
            query: params,
        });
    }

    public static labelsCreate(data: Label): CancelablePromise<Label> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/labels/',
            body: data,
        });
    }

    public static labelsRead(labelId: number): CancelablePromise<Label> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/labels/{label_id}/',
            path: { label_id: labelId },
        });
    }

    public static labelsUpdate(labelId: number, data: Label): CancelablePromise<Label> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/labels/{label_id}/',
            path: { label_id: labelId },
            body: data,
        });
    }

    public static labelsPartialUpdate(labelId: number, data: Partial<Label>): CancelablePromise<Label> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/labels/{label_id}/',
            path: { label_id: labelId },
            body: data,
        });
    }

    public static labelsDelete(labelId: number): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/labels/{label_id}/',
            path: { label_id: labelId },
        });
    }
}
