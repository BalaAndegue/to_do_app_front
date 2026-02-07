/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Board } from '../models/Board';
import type { BoardInvitation } from '../models/BoardInvitation';
import type { BoardMember } from '../models/BoardMember';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BoardsService {
    /**
     * ViewSet for viewing and editing boards.
     * @returns Board
     * @throws ApiError
     */
    public static boardsList(): CancelablePromise<Array<Board>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/boards/',
        });
    }
    /**
     * ViewSet for viewing and editing boards.
     * @param data
     * @returns Board
     * @throws ApiError
     */
    public static boardsCreate(
        data: Board,
    ): CancelablePromise<Board> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/boards/',
            body: data,
        });
    }
    /**
     * ViewSet for viewing and editing boards.
     * @param id
     * @returns Board
     * @throws ApiError
     */
    public static boardsRead(
        id: string,
    ): CancelablePromise<Board> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/boards/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * ViewSet for viewing and editing boards.
     * @param id
     * @param data
     * @returns Board
     * @throws ApiError
     */
    public static boardsUpdate(
        id: string,
        data: Board,
    ): CancelablePromise<Board> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/boards/{id}/',
            path: {
                'id': id,
            },
            body: data,
        });
    }
    /**
     * ViewSet for viewing and editing boards.
     * @param id
     * @param data
     * @returns Board
     * @throws ApiError
     */
    public static boardsPartialUpdate(
        id: string,
        data: Board,
    ): CancelablePromise<Board> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/boards/{id}/',
            path: {
                'id': id,
            },
            body: data,
        });
    }
    /**
     * ViewSet for viewing and editing boards.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static boardsDelete(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/boards/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Invite a user to the board by email.
     * @param id
     * @param data
     * @returns BoardInvitation
     * @throws ApiError
     */
    public static boardsInvite(
        id: string,
        data: {
            /**
             * Email of the user to invite
             */
            email: string;
        },
    ): CancelablePromise<BoardInvitation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/boards/{id}/invite/',
            path: {
                'id': id,
            },
            body: data,
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Get all members of the board.
     * @param id
     * @returns BoardMember
     * @throws ApiError
     */
    public static boardsMembers(
        id: string,
    ): CancelablePromise<Array<BoardMember>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/boards/{id}/members/',
            path: {
                'id': id,
            },
        });
    }
}
