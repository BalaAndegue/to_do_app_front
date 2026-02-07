/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { List } from '../models/List';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ListsService {
    /**
     * @returns List
     * @throws ApiError
     */
    public static listsList(): CancelablePromise<Array<List>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/lists/',
        });
    }
    /**
     * @param data
     * @returns List
     * @throws ApiError
     */
    public static listsCreate(
        data: List,
    ): CancelablePromise<List> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/lists/',
            body: data,
        });
    }
    /**
     * @param listId
     * @returns List
     * @throws ApiError
     */
    public static listsRead(
        listId: string,
    ): CancelablePromise<List> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/lists/{list_id}/',
            path: {
                'list_id': listId,
            },
        });
    }
    /**
     * @param listId
     * @param data
     * @returns List
     * @throws ApiError
     */
    public static listsUpdate(
        listId: string,
        data: List,
    ): CancelablePromise<List> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/lists/{list_id}/',
            path: {
                'list_id': listId,
            },
            body: data,
        });
    }
    /**
     * @param listId
     * @param data
     * @returns List
     * @throws ApiError
     */
    public static listsPartialUpdate(
        listId: string,
        data: List,
    ): CancelablePromise<List> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/lists/{list_id}/',
            path: {
                'list_id': listId,
            },
            body: data,
        });
    }
    /**
     * @param listId
     * @returns void
     * @throws ApiError
     */
    public static listsDelete(
        listId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/lists/{list_id}/',
            path: {
                'list_id': listId,
            },
        });
    }
}
