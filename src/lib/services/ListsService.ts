import type { List } from '../models/List';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type PaginatedLists = { count: number; next: string | null; previous: string | null; results: List[] };

export class ListsService {
    public static listsList(params?: {
        board?: number;
        archived?: boolean;
        page?: number;
    }): CancelablePromise<PaginatedLists> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/lists/',
            query: params,
        });
    }

    public static listsCreate(data: List): CancelablePromise<List> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/lists/',
            body: data,
        });
    }

    public static listsRead(listId: string): CancelablePromise<List> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/lists/{list_id}/',
            path: { list_id: listId },
        });
    }

    public static listsUpdate(listId: string, data: List): CancelablePromise<List> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/lists/{list_id}/',
            path: { list_id: listId },
            body: data,
        });
    }

    public static listsPartialUpdate(listId: string, data: Partial<List>): CancelablePromise<List> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/lists/{list_id}/',
            path: { list_id: listId },
            body: data,
        });
    }

    public static listsDelete(listId: string): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/lists/{list_id}/',
            path: { list_id: listId },
        });
    }
}
