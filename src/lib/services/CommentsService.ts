/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Comment } from '../models/Comment';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CommentsService {
    /**
     * @returns Comment
     * @throws ApiError
     */
    public static commentsList(): CancelablePromise<Array<Comment>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/comments/',
        });
    }
    /**
     * @param data
     * @returns Comment
     * @throws ApiError
     */
    public static commentsCreate(
        data: Comment,
    ): CancelablePromise<Comment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/comments/',
            body: data,
        });
    }
    /**
     * @param id
     * @returns Comment
     * @throws ApiError
     */
    public static commentsRead(
        id: string,
    ): CancelablePromise<Comment> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/comments/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @param data
     * @returns Comment
     * @throws ApiError
     */
    public static commentsUpdate(
        id: string,
        data: Comment,
    ): CancelablePromise<Comment> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/comments/{id}/',
            path: {
                'id': id,
            },
            body: data,
        });
    }
    /**
     * @param id
     * @param data
     * @returns Comment
     * @throws ApiError
     */
    public static commentsPartialUpdate(
        id: string,
        data: Comment,
    ): CancelablePromise<Comment> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/comments/{id}/',
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
    public static commentsDelete(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/comments/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
