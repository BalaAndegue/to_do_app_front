/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from './User';
export type Comment = {
    readonly comment_id?: number;
    card: number;
    user: number;
    user_details?: User;
    content: string;
    readonly created_at?: string;
    readonly updated_at?: string;
};

