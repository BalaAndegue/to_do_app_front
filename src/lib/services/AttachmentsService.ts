import type { Attachment } from '../models/Attachment';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type PaginatedAttachments = { count: number; next: string | null; previous: string | null; results: Attachment[] };

export class AttachmentsService {
    public static attachmentsList(params?: { card?: number; page?: number }): CancelablePromise<PaginatedAttachments> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/attachments/',
            query: params,
        });
    }

    public static attachmentsCreate(data: Attachment): CancelablePromise<Attachment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/attachments/',
            body: data,
        });
    }

    public static attachmentsRead(attachId: number): CancelablePromise<Attachment> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/attachments/{attach_id}/',
            path: { attach_id: attachId },
        });
    }

    public static attachmentsDelete(attachId: number): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/attachments/{attach_id}/',
            path: { attach_id: attachId },
        });
    }
}
