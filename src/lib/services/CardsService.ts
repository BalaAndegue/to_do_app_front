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
     * @param cardId
     * @returns Card
     * @throws ApiError
     */
    public static cardsRead(
        cardId: string,
    ): CancelablePromise<Card> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/cards/{card_id}/',
            path: {
                'card_id': cardId,
            },
        });
    }
    /**
     * ViewSet for viewing and editing cards.
     * @param cardId
     * @param data
     * @returns Card
     * @throws ApiError
     */
    public static cardsUpdate(
        cardId: string,
        data: Card,
    ): CancelablePromise<Card> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/cards/{card_id}/',
            path: {
                'card_id': cardId,
            },
            body: data,
        });
    }
    /**
     * ViewSet for viewing and editing cards.
     * @param cardId
     * @param data
     * @returns Card
     * @throws ApiError
     */
    public static cardsPartialUpdate(
        cardId: string,
        data: Card,
    ): CancelablePromise<Card> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/cards/{card_id}/',
            path: {
                'card_id': cardId,
            },
            body: data,
        });
    }
    /**
     * ViewSet for viewing and editing cards.
     * @param cardId
     * @returns void
     * @throws ApiError
     */
    public static cardsDelete(
        cardId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/cards/{card_id}/',
            path: {
                'card_id': cardId,
            },
        });
    }
    /**
     * Move a card to a new position or list.
     * @param cardId
     * @param data
     * @returns Card
     * @throws ApiError
     */
    public static cardsMove(
        cardId: string,
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
            url: '/cards/{card_id}/move/',
            path: {
                'card_id': cardId,
            },
            body: data,
            errors: {
                400: `Bad Request`,
                404: `List not found`,
            },
        });
    }
}
