import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type PaginatedUsers = { count: number; next: string | null; previous: string | null; results: User[] };

export class UsersService {
    public static usersList(params?: { page?: number }): CancelablePromise<PaginatedUsers> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/',
            query: params,
        });
    }

    public static usersMe(): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me/',
        });
    }

    public static usersChangePassword(data: { new_password: string }): CancelablePromise<{ success: boolean; message: string; data: { token: string } }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/change_password/',
            body: data,
        });
    }

    public static usersCreate(data: User): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/',
            body: data,
        });
    }

    public static usersRead(userId: number): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_id}/',
            path: { user_id: userId },
        });
    }

    public static usersUpdate(userId: number, data: User): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{user_id}/',
            path: { user_id: userId },
            body: data,
        });
    }

    public static usersPartialUpdate(userId: number, data: Partial<User>): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/users/{user_id}/',
            path: { user_id: userId },
            body: data,
        });
    }

    public static usersDelete(userId: number): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{user_id}/',
            path: { user_id: userId },
        });
    }
}
