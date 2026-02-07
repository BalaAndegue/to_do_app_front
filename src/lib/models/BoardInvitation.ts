/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from './User';
export type BoardInvitation = {
    readonly id?: number;
    board: number;
    readonly board_name?: string;
    inviter: number;
    inviter_details?: User;
    email: string;
    readonly token?: string;
    readonly accepted?: boolean;
    readonly created_at?: string;
};

