/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from './User';
export type BoardMember = {
    readonly id?: number;
    board: number;
    user: number;
    user_details?: User;
    role?: BoardMember.role;
    readonly joined_at?: string;
};
export namespace BoardMember {
    export enum role {
        ADMIN = 'admin',
        MEMBER = 'member',
        OBSERVER = 'observer',
    }
}

