/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChecklistItem } from './ChecklistItem';
export type Checklist = {
    readonly checklist_id?: number;
    card: number;
    name: string;
    position?: number;
    readonly created_at?: string;
    readonly items?: Array<ChecklistItem>;
};

