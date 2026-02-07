/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Attachment } from './Attachment';
import type { CardLabel } from './CardLabel';
import type { CardMember } from './CardMember';
import type { Checklist } from './Checklist';
export type Card = {
    readonly card_id?: number;
    readonly labels?: Array<CardLabel>;
    readonly members?: Array<CardMember>;
    readonly checklists?: Array<Checklist>;
    readonly attachments?: Array<Attachment>;
    readonly comments_count?: number;
    title: string;
    description?: string | null;
    start_date?: string | null;
    due_date?: string | null;
    due_date_complete?: boolean;
    cover_image_url?: string | null;
    position: number;
    archived?: boolean;
    readonly created_at?: string;
    readonly updated_at?: string;
    list: number;
    board: number;
};

