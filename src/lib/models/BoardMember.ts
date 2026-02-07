/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BoardMember = {
    readonly id?: number;
    role?: BoardMember.role;
    board: number;
    user: number;
};
export namespace BoardMember {
    export enum role {
        ADMIN = 'admin',
        MEMBER = 'member',
    }
}

