/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * @returns User
     * @throws ApiError
     */
    public static usersList(): CancelablePromise<Array<User>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/',
        });
    }
    /**
     * @param data
     * @returns User
     * @throws ApiError
     */
    public static usersCreate(
        data: User,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/',
            body: data,
        });
    }
    /**
     * @param userId A unique integer value identifying this user.
     * @returns User
     * @throws ApiError
     */
    public static usersRead(
        userId: number,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_id}/',
            path: {
                'user_id': userId,
            },
        });
    }
    /**
     * @param userId A unique integer value identifying this user.
     * @param data
     * @returns User
     * @throws ApiError
     */
    public static usersUpdate(
        userId: number,
        data: User,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{user_id}/',
            path: {
                'user_id': userId,
            },
            body: data,
        });
    }
    /**
     * @param userId A unique integer value identifying this user.
     * @param data
     * @returns User
     * @throws ApiError
     */
    public static usersPartialUpdate(
        userId: number,
        data: User,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/users/{user_id}/',
            path: {
                'user_id': userId,
            },
            body: data,
        });
    }
    /**
     * @param userId A unique integer value identifying this user.
     * @returns void
     * @throws ApiError
     */
    public static usersDelete(
        userId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{user_id}/',
            path: {
                'user_id': userId,
            },
        });
    }
    /**
     * @param userId A unique integer value identifying this user.
     * @param data
     * @returns User
     * @throws ApiError
     */
    public static usersResetPassword(
        userId: number,
        data: User,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/{user_id}/reset_password/',
            path: {
                'user_id': userId,
            },
            body: data,
        });
    }
}
