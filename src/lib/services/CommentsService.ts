import type { Comment } from '../models/Comment';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type PaginatedComments = { count: number; next: string | null; previous: string | null; results: Comment[] };

export class CommentsService {
    public static commentsList(params?: { card?: number; page?: number }): CancelablePromise<PaginatedComments> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/comments/',
            query: params,
        });
    }

    public static commentsCreate(data: Comment): CancelablePromise<Comment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/comments/',
            body: data,
        });
    }

    public static commentsRead(commentId: string): CancelablePromise<Comment> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/comments/{comment_id}/',
            path: { comment_id: commentId },
        });
    }

    public static commentsUpdate(commentId: string, data: Comment): CancelablePromise<Comment> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/comments/{comment_id}/',
            path: { comment_id: commentId },
            body: data,
        });
    }

    public static commentsPartialUpdate(commentId: string, data: Partial<Comment>): CancelablePromise<Comment> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/comments/{comment_id}/',
            path: { comment_id: commentId },
            body: data,
        });
    }

    public static commentsDelete(commentId: string): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/comments/{comment_id}/',
            path: { comment_id: commentId },
        });
    }
}
