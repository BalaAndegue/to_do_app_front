/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Board = {
    readonly board_id?: number;
    name: string;
    description?: string | null;
    visibility?: Board.visibility;
    position?: number;
    readonly created_at?: string;
    readonly updated_at?: string;
    readonly creator?: number;
};
export namespace Board {
    export enum visibility {
        PUBLIC = 'public',
        PRIVATE = 'private',
    }
}

