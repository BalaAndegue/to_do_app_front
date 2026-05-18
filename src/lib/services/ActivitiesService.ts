import type { Activity } from '../models/Activity';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export type PaginatedActivities = { count: number; next: string | null; previous: string | null; results: Activity[] };

export class ActivitiesService {
    public static activitiesList(params?: { board?: number; card?: number; page?: number }): CancelablePromise<PaginatedActivities> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/activities/',
            query: params,
        });
    }

    public static activitiesRead(activityId: number): CancelablePromise<Activity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/activities/{activity_id}/',
            path: { activity_id: activityId },
        });
    }
}
