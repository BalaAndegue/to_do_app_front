/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BoardMember } from '../models/BoardMember';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BoardMembersService {
    /**
     * @returns BoardMember
     * @throws ApiError
     */
    public static boardMembersList(): CancelablePromise<Array<BoardMember>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/board-members/',
        });
    }
    /**
     * @param data
     * @returns BoardMember
     * @throws ApiError
     */
    public static boardMembersCreate(
        data: BoardMember,
    ): CancelablePromise<BoardMember> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/board-members/',
            body: data,
        });
    }
    /**
     * @param id
     * @returns BoardMember
     * @throws ApiError
     */
    public static boardMembersRead(
        id: string,
    ): CancelablePromise<BoardMember> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/board-members/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param data
     * @returns BoardMember
     * @throws ApiError
     */
    public static boardMembersUpdate(
        id: string,
        data: BoardMember,
    ): CancelablePromise<BoardMember> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/board-members/{id}/',
            path: {
                'id': id,
            },
            body: data,
        });
    }
    /**
     * @param id
     * @param data
     * @returns BoardMember
     * @throws ApiError
     */
    public static boardMembersPartialUpdate(
        id: string,
        data: BoardMember,
    ): CancelablePromise<BoardMember> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/board-members/{id}/',
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
    public static boardMembersDelete(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/board-members/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
