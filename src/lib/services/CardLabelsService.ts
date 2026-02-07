/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CardLabel } from '../models/CardLabel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CardLabelsService {
    /**
     * @returns CardLabel
     * @throws ApiError
     */
    public static cardLabelsList(): CancelablePromise<Array<CardLabel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/card-labels/',
        });
    }
    /**
     * @param data
     * @returns CardLabel
     * @throws ApiError
     */
    public static cardLabelsCreate(
        data: CardLabel,
    ): CancelablePromise<CardLabel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/card-labels/',
            body: data,
        });
    }
    /**
     * @param id A unique integer value identifying this card label.
     * @returns CardLabel
     * @throws ApiError
     */
    public static cardLabelsRead(
        id: number,
    ): CancelablePromise<CardLabel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/card-labels/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this card label.
     * @param data
     * @returns CardLabel
     * @throws ApiError
     */
    public static cardLabelsUpdate(
        id: number,
        data: CardLabel,
    ): CancelablePromise<CardLabel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/card-labels/{id}/',
            path: {
                'id': id,
            },
            body: data,
        });
    }
    /**
     * @param id A unique integer value identifying this card label.
     * @param data
     * @returns CardLabel
     * @throws ApiError
     */
    public static cardLabelsPartialUpdate(
        id: number,
        data: CardLabel,
    ): CancelablePromise<CardLabel> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/card-labels/{id}/',
            path: {
                'id': id,
            },
            body: data,
        });
    }
    /**
     * @param id A unique integer value identifying this card label.
     * @returns void
     * @throws ApiError
     */
    public static cardLabelsDelete(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/card-labels/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
