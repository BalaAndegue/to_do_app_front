import type { Login } from '../models/Login';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LoginService {
    public static loginCreate(data: Login): CancelablePromise<{ token: string; user: User }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/login/',
            body: data,
        });
    }
}
