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
     * @param commentId A unique integer value identifying this comment.
     * @returns Comment
     * @throws ApiError
     */
    public static commentsRead(
        commentId: number,
    ): CancelablePromise<Comment> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/comments/{comment_id}/',
            path: {
                'comment_id': commentId,
            },
        });
    }
    /**
     * @param commentId A unique integer value identifying this comment.
     * @param data
     * @returns Comment
     * @throws ApiError
     */
    public static commentsUpdate(
        commentId: number,
        data: Comment,
    ): CancelablePromise<Comment> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/comments/{comment_id}/',
            path: {
                'comment_id': commentId,
            },
            body: data,
        });
    }
    /**
     * @param commentId A unique integer value identifying this comment.
     * @param data
     * @returns Comment
     * @throws ApiError
     */
    public static commentsPartialUpdate(
        commentId: number,
        data: Comment,
    ): CancelablePromise<Comment> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/comments/{comment_id}/',
            path: {
                'comment_id': commentId,
            },
            body: data,
        });
    }
    /**
     * @param commentId A unique integer value identifying this comment.
     * @returns void
     * @throws ApiError
     */
    public static commentsDelete(
        commentId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/comments/{comment_id}/',
            path: {
                'comment_id': commentId,
            },
        });
    }
}
