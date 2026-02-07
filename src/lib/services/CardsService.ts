/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Card } from '../models/Card';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CardsService {
    /**
     * ViewSet for viewing and editing cards.
     * @returns Card
     * @throws ApiError
     */
    public static cardsList(): CancelablePromise<Array<Card>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cards/',
        });
    }
    /**
     * ViewSet for viewing and editing cards.
     * @param data
     * @returns Card
     * @throws ApiError
     */
    public static cardsCreate(
        data: Card,
    ): CancelablePromise<Card> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cards/',
            body: data,
        });
    }
    /**
     * ViewSet for viewing and editing cards.
     * @param id
     * @returns Card
     * @throws ApiError
     */
    public static cardsRead(
        id: string,
    ): CancelablePromise<Card> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cards/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * ViewSet for viewing and editing cards.
     * @param id
     * @param data
     * @returns Card
     * @throws ApiError
     */
    public static cardsUpdate(
        id: string,
        data: Card,
    ): CancelablePromise<Card> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/cards/{id}/',
            path: {
                'id': id,
            },
            body: data,
        });
    }
    /**
     * ViewSet for viewing and editing cards.
     * @param id
     * @param data
     * @returns Card
     * @throws ApiError
     */
    public static cardsPartialUpdate(
        id: string,
        data: Card,
    ): CancelablePromise<Card> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/cards/{id}/',
            path: {
                'id': id,
            },
            body: data,
        });
    }
    /**
     * ViewSet for viewing and editing cards.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static cardsDelete(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/cards/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Move a card to a new position or list.
     * @param id
     * @param data
     * @returns Card
     * @throws ApiError
     */
    public static cardsMove(
        id: string,
        data: {
            /**
             * New position of the card
             */
            position: number;
            /**
             * ID of the new list to move to (optional)
             */
            list_id?: number;
        },
    ): CancelablePromise<Card> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/cards/{id}/move/',
            path: {
                'id': id,
            },
            body: data,
            errors: {
                400: `Bad Request`,
                404: `List not found`,
            },
        });
    }
}
