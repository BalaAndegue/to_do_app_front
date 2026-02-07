/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Attachment } from '../models/Attachment';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AttachmentsService {
    /**
     * @returns Attachment
     * @throws ApiError
     */
    public static attachmentsList(): CancelablePromise<Array<Attachment>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/attachments/',
        });
    }
    /**
     * @param data
     * @returns Attachment
     * @throws ApiError
     */
    public static attachmentsCreate(
        data: Attachment,
    ): CancelablePromise<Attachment> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/attachments/',
            body: data,
        });
    }
    /**
     * @param attachId A unique integer value identifying this attachment.
     * @returns Attachment
     * @throws ApiError
     */
    public static attachmentsRead(
        attachId: number,
    ): CancelablePromise<Attachment> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/attachments/{attach_id}/',
            path: {
                'attach_id': attachId,
            },
        });
    }
    /**
     * @param attachId A unique integer value identifying this attachment.
     * @param data
     * @returns Attachment
     * @throws ApiError
     */
    public static attachmentsUpdate(
        attachId: number,
        data: Attachment,
    ): CancelablePromise<Attachment> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/attachments/{attach_id}/',
            path: {
                'attach_id': attachId,
            },
            body: data,
        });
    }
    /**
     * @param attachId A unique integer value identifying this attachment.
     * @param data
     * @returns Attachment
     * @throws ApiError
     */
    public static attachmentsPartialUpdate(
        attachId: number,
        data: Attachment,
    ): CancelablePromise<Attachment> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/attachments/{attach_id}/',
            path: {
                'attach_id': attachId,
            },
            body: data,
        });
    }
    /**
     * @param attachId A unique integer value identifying this attachment.
     * @returns void
     * @throws ApiError
     */
    public static attachmentsDelete(
        attachId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/attachments/{attach_id}/',
            path: {
                'attach_id': attachId,
            },
        });
    }
}
