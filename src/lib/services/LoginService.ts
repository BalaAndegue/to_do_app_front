/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Login } from '../models/Login';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LoginService {
    /**
     * API pour se connecter avec email et mot de passe.
     * @param data
     * @returns any Connexion réussie
     * @throws ApiError
     */
    public static loginCreate(
        data: Login,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/login/',
            body: data,
            errors: {
                400: `Échec de connexion`,
            },
        });
    }
}
