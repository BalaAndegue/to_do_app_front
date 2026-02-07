/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from './User';
export type Attachment = {
    readonly attach_id?: number;
    card: number;
    filename: string;
    url: string;
    mime_type: string;
    size: number;
    uploaded_by: number;
    uploaded_by_details?: User;
    readonly uploaded_at?: string;
};

