/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Board } from '../models/Board';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BoardsService {
    /**
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
     * @param boardId A unique integer value identifying this board.
     * @returns Board
     * @throws ApiError
     */
    public static boardsRead(
        boardId: number,
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
     * @param boardId A unique integer value identifying this board.
     * @param data
     * @returns Board
     * @throws ApiError
     */
    public static boardsUpdate(
        boardId: number,
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
     * @param boardId A unique integer value identifying this board.
     * @param data
     * @returns Board
     * @throws ApiError
     */
    public static boardsPartialUpdate(
        boardId: number,
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
     * @param boardId A unique integer value identifying this board.
     * @returns void
     * @throws ApiError
     */
    public static boardsDelete(
        boardId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/boards/{board_id}/',
            path: {
                'board_id': boardId,
            },
        });
    }
}
