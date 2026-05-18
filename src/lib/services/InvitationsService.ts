import type { BoardInvitation } from '../models/BoardInvitation';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type PaginatedInvitations = { count: number; next: string | null; previous: string | null; results: BoardInvitation[] };

export class InvitationsService {
    public static invitationsList(params?: { page?: number }): CancelablePromise<PaginatedInvitations> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/invitations/',
            query: params,
        });
    }

    public static invitationsAccept(data: { token: string }): CancelablePromise<{
        success: boolean;
        message: string;
        board_id: number;
        board_name: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/invitations/accept/',
            body: data,
        });
    }

    public static invitationsRead(id: number): CancelablePromise<BoardInvitation> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/invitations/{id}/',
            path: { id },
        });
    }

    public static invitationsDelete(id: number): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/invitations/{id}/',
            path: { id },
        });
    }
}
