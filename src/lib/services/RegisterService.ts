/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RegisterService {
    /**
     * API pour enregistrer un nouvel utilisateur.
     * @param data
     * @returns any Utilisateur créé avec succès
     * @throws ApiError
     */
    public static registerCreate(
        data: User,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/register/',
            body: data,
            errors: {
                400: `Erreur de validation`,
            },
        });
    }
}
