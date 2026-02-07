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
     * @param cardId A unique integer value identifying this card.
     * @returns Card
     * @throws ApiError
     */
    public static cardsRead(
        cardId: number,
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
     * @param cardId A unique integer value identifying this card.
     * @param data
     * @returns Card
     * @throws ApiError
     */
    public static cardsUpdate(
        cardId: number,
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
     * @param cardId A unique integer value identifying this card.
     * @param data
     * @returns Card
     * @throws ApiError
     */
    public static cardsPartialUpdate(
        cardId: number,
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
     * @param cardId A unique integer value identifying this card.
     * @returns void
     * @throws ApiError
     */
    public static cardsDelete(
        cardId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/cards/{card_id}/',
            path: {
                'card_id': cardId,
            },
        });
    }
}
