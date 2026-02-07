/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BoardInvitation } from '../models/BoardInvitation';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InvitationsService {
    /**
     * @returns BoardInvitation
     * @throws ApiError
     */
    public static invitationsList(): CancelablePromise<Array<BoardInvitation>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/invitations/',
        });
    }
    /**
     * @param data
     * @returns BoardInvitation
     * @throws ApiError
     */
    public static invitationsCreate(
        data: BoardInvitation,
    ): CancelablePromise<BoardInvitation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invitations/',
            body: data,
        });
    }
    /**
     * @param data
     * @returns BoardInvitation
     * @throws ApiError
     */
    public static invitationsAccept(
        data: BoardInvitation,
    ): CancelablePromise<BoardInvitation> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invitations/accept/',
            body: data,
        });
    }
    /**
     * @param id A unique integer value identifying this board invitation.
     * @returns BoardInvitation
     * @throws ApiError
     */
    public static invitationsRead(
        id: number,
    ): CancelablePromise<BoardInvitation> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/invitations/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this board invitation.
     * @param data
     * @returns BoardInvitation
     * @throws ApiError
     */
    public static invitationsUpdate(
        id: number,
        data: BoardInvitation,
    ): CancelablePromise<BoardInvitation> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/invitations/{id}/',
            path: {
                'id': id,
            },
            body: data,
        });
    }
    /**
     * @param id A unique integer value identifying this board invitation.
     * @param data
     * @returns BoardInvitation
     * @throws ApiError
     */
    public static invitationsPartialUpdate(
        id: number,
        data: BoardInvitation,
    ): CancelablePromise<BoardInvitation> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/invitations/{id}/',
            path: {
                'id': id,
            },
            body: data,
        });
    }
    /**
     * @param id A unique integer value identifying this board invitation.
     * @returns void
     * @throws ApiError
     */
    public static invitationsDelete(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/invitations/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
