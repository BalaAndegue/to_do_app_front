/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from './User';
export type Activity = {
    readonly activity_id?: number;
    user_details?: User;
    action_type: string;
    content: string;
    readonly created_at?: string;
    board: number;
    card?: number | null;
    list?: number | null;
    user: number;
};

