/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CardMember } from '../models/CardMember';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CardMembersService {
    /**
     * @returns CardMember
     * @throws ApiError
     */
    public static cardMembersList(): CancelablePromise<Array<CardMember>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/card-members/',
        });
    }
    /**
     * @param data
     * @returns CardMember
     * @throws ApiError
     */
    public static cardMembersCreate(
        data: CardMember,
    ): CancelablePromise<CardMember> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/card-members/',
            body: data,
        });
    }
    /**
     * @param id A unique integer value identifying this card member.
     * @returns CardMember
     * @throws ApiError
     */
    public static cardMembersRead(
        id: number,
    ): CancelablePromise<CardMember> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/card-members/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this card member.
     * @param data
     * @returns CardMember
     * @throws ApiError
     */
    public static cardMembersUpdate(
        id: number,
        data: CardMember,
    ): CancelablePromise<CardMember> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/card-members/{id}/',
            path: {
                'id': id,
            },
            body: data,
        });
    }
    /**
     * @param id A unique integer value identifying this card member.
     * @param data
     * @returns CardMember
     * @throws ApiError
     */
    public static cardMembersPartialUpdate(
        id: number,
        data: CardMember,
    ): CancelablePromise<CardMember> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/card-members/{id}/',
            path: {
                'id': id,
            },
            body: data,
        });
    }
    /**
     * @param id A unique integer value identifying this card member.
     * @returns void
     * @throws ApiError
     */
    public static cardMembersDelete(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/card-members/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
