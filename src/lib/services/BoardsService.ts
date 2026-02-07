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
     * @param boardId
     * @returns Board
     * @throws ApiError
     */
    public static boardsRead(
        boardId: string,
    ): CancelablePromise<Board> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/boards/{board_id}/',
            path: {
                'board_id': boardId,
            },
        });
    }
    /**
     * ViewSet for viewing and editing boards.
     * @param boardId
     * @param data
     * @returns Board
     * @throws ApiError
     */
    public static boardsUpdate(
        boardId: string,
        data: Board,
    ): CancelablePromise<Board> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/boards/{board_id}/',
            path: {
                'board_id': boardId,
            },
            body: data,
        });
    }
    /**
     * ViewSet for viewing and editing boards.
     * @param boardId
     * @param data
     * @returns Board
     * @throws ApiError
     */
    public static boardsPartialUpdate(
        boardId: string,
        data: Board,
    ): CancelablePromise<Board> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/boards/{board_id}/',
            path: {
                'board_id': boardId,
            },
            body: data,
        });
    }
    /**
     * ViewSet for viewing and editing boards.
     * @param boardId
     * @returns void
     * @throws ApiError
     */
    public static boardsDelete(
        boardId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/boards/{board_id}/',
            path: {
                'board_id': boardId,
            },
        });
    }
    /**
     * Invite a user to the board by email.
     * @param boardId
     * @param data
     * @returns BoardInvitation
     * @throws ApiError
     */
    public static boardsInvite(
        boardId: string,
        data: {
            /**
             * Email of the user to invite
             */
            email: string;
        },
    ): CancelablePromise<BoardInvitation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/boards/{board_id}/invite/',
            path: {
                'board_id': boardId,
            },
            body: data,
            errors: {
                400: `Bad Request`,
            },
        });
    }
    /**
     * Get all members of the board.
     * @param boardId
     * @returns BoardMember
     * @throws ApiError
     */
    public static boardsMembers(
        boardId: string,
    ): CancelablePromise<Array<BoardMember>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/boards/{board_id}/members/',
            path: {
                'board_id': boardId,
            },
        });
    }
}
