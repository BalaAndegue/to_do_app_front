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
     * @param id
     * @returns List
     * @throws ApiError
     */
    public static listsRead(
        id: string,
    ): CancelablePromise<List> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/lists/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param data
     * @returns List
     * @throws ApiError
     */
    public static listsUpdate(
        id: string,
        data: List,
    ): CancelablePromise<List> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/lists/{id}/',
            path: {
                'id': id,
            },
            body: data,
        });
    }
    /**
     * @param id
     * @param data
     * @returns List
     * @throws ApiError
     */
    public static listsPartialUpdate(
        id: string,
        data: List,
    ): CancelablePromise<List> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/lists/{id}/',
            path: {
                'id': id,
            },
            body: data,
        });
    }
    /**
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static listsDelete(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/lists/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
