/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BoardMember } from './BoardMember';
import type { List } from './List';
import type { User } from './User';
export type Board = {
    readonly board_id?: number;
    name: string;
    description?: string | null;
    visibility?: Board.visibility;
    background_type?: string;
    background_value?: string;
    readonly creator?: number;
    creator_details?: User;
    position?: number;
    is_closed?: boolean;
    readonly created_at?: string;
    readonly updated_at?: string;
    readonly lists?: Array<List>;
    readonly members?: Array<BoardMember>;
};
export namespace Board {
    export enum visibility {
        PUBLIC = 'public',
        PRIVATE = 'private',
        WORKSPACE = 'workspace',
    }
}

