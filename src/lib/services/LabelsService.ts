/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Label } from '../models/Label';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LabelsService {
    /**
     * @returns Label
     * @throws ApiError
     */
    public static labelsList(): CancelablePromise<Array<Label>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/labels/',
        });
    }
    /**
     * @param data
     * @returns Label
     * @throws ApiError
     */
    public static labelsCreate(
        data: Label,
    ): CancelablePromise<Label> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/labels/',
            body: data,
        });
    }
    /**
     * @param labelId A unique integer value identifying this label.
     * @returns Label
     * @throws ApiError
     */
    public static labelsRead(
        labelId: number,
    ): CancelablePromise<Label> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/labels/{label_id}/',
            path: {
                'label_id': labelId,
            },
        });
    }
    /**
     * @param labelId A unique integer value identifying this label.
     * @param data
     * @returns Label
     * @throws ApiError
     */
    public static labelsUpdate(
        labelId: number,
        data: Label,
    ): CancelablePromise<Label> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/labels/{label_id}/',
            path: {
                'label_id': labelId,
            },
            body: data,
        });
    }
    /**
     * @param labelId A unique integer value identifying this label.
     * @param data
     * @returns Label
     * @throws ApiError
     */
    public static labelsPartialUpdate(
        labelId: number,
        data: Label,
    ): CancelablePromise<Label> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/labels/{label_id}/',
            path: {
                'label_id': labelId,
            },
            body: data,
        });
    }
    /**
     * @param labelId A unique integer value identifying this label.
     * @returns void
     * @throws ApiError
     */
    public static labelsDelete(
        labelId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/labels/{label_id}/',
            path: {
                'label_id': labelId,
            },
        });
    }
}
