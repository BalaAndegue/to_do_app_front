/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChecklistItem } from '../models/ChecklistItem';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChecklistItemsService {
    /**
     * @returns ChecklistItem
     * @throws ApiError
     */
    public static checklistItemsList(): CancelablePromise<Array<ChecklistItem>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checklist-items/',
        });
    }
    /**
     * @param data
     * @returns ChecklistItem
     * @throws ApiError
     */
    public static checklistItemsCreate(
        data: ChecklistItem,
    ): CancelablePromise<ChecklistItem> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/checklist-items/',
            body: data,
        });
    }
    /**
     * @param itemId A unique integer value identifying this checklist item.
     * @returns ChecklistItem
     * @throws ApiError
     */
    public static checklistItemsRead(
        itemId: number,
    ): CancelablePromise<ChecklistItem> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checklist-items/{item_id}/',
            path: {
                'item_id': itemId,
            },
        });
    }
    /**
     * @param itemId A unique integer value identifying this checklist item.
     * @param data
     * @returns ChecklistItem
     * @throws ApiError
     */
    public static checklistItemsUpdate(
        itemId: number,
        data: ChecklistItem,
    ): CancelablePromise<ChecklistItem> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/checklist-items/{item_id}/',
            path: {
                'item_id': itemId,
            },
            body: data,
        });
    }
    /**
     * @param itemId A unique integer value identifying this checklist item.
     * @param data
     * @returns ChecklistItem
     * @throws ApiError
     */
    public static checklistItemsPartialUpdate(
        itemId: number,
        data: ChecklistItem,
    ): CancelablePromise<ChecklistItem> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/checklist-items/{item_id}/',
            path: {
                'item_id': itemId,
            },
            body: data,
        });
    }
    /**
     * @param itemId A unique integer value identifying this checklist item.
     * @returns void
     * @throws ApiError
     */
    public static checklistItemsDelete(
        itemId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/checklist-items/{item_id}/',
            path: {
                'item_id': itemId,
            },
        });
    }
}
