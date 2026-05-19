import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class RegisterService {
    public static registerCreate(data: {
        username: string;
        email: string;
        password: string;
    }): CancelablePromise<{ token: string; user: User }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/register/',
            body: data,
        });
    }
}
