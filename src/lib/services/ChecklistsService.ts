/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Checklist } from '../models/Checklist';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChecklistsService {
    /**
     * @returns Checklist
     * @throws ApiError
     */
    public static checklistsList(): CancelablePromise<Array<Checklist>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checklists/',
        });
    }
    /**
     * @param data
     * @returns Checklist
     * @throws ApiError
     */
    public static checklistsCreate(
        data: Checklist,
    ): CancelablePromise<Checklist> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/checklists/',
            body: data,
        });
    }
    /**
     * @param checklistId A unique integer value identifying this checklist.
     * @returns Checklist
     * @throws ApiError
     */
    public static checklistsRead(
        checklistId: number,
    ): CancelablePromise<Checklist> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/checklists/{checklist_id}/',
            path: {
                'checklist_id': checklistId,
            },
        });
    }
    /**
     * @param checklistId A unique integer value identifying this checklist.
     * @param data
     * @returns Checklist
     * @throws ApiError
     */
    public static checklistsUpdate(
        checklistId: number,
        data: Checklist,
    ): CancelablePromise<Checklist> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/checklists/{checklist_id}/',
            path: {
                'checklist_id': checklistId,
            },
            body: data,
        });
    }
    /**
     * @param checklistId A unique integer value identifying this checklist.
     * @param data
     * @returns Checklist
     * @throws ApiError
     */
    public static checklistsPartialUpdate(
        checklistId: number,
        data: Checklist,
    ): CancelablePromise<Checklist> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/checklists/{checklist_id}/',
            path: {
                'checklist_id': checklistId,
            },
            body: data,
        });
    }
    /**
     * @param checklistId A unique integer value identifying this checklist.
     * @returns void
     * @throws ApiError
     */
    public static checklistsDelete(
        checklistId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/checklists/{checklist_id}/',
            path: {
                'checklist_id': checklistId,
            },
        });
    }
}
