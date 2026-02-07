/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Activity } from '../models/Activity';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ActivitiesService {
    /**
     * @returns Activity
     * @throws ApiError
     */
    public static activitiesList(): CancelablePromise<Array<Activity>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/activities/',
        });
    }
    /**
     * @param data
     * @returns Activity
     * @throws ApiError
     */
    public static activitiesCreate(
        data: Activity,
    ): CancelablePromise<Activity> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/activities/',
            body: data,
        });
    }
    /**
     * @param activityId A unique integer value identifying this activity.
     * @returns Activity
     * @throws ApiError
     */
    public static activitiesRead(
        activityId: number,
    ): CancelablePromise<Activity> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/activities/{activity_id}/',
            path: {
                'activity_id': activityId,
            },
        });
    }
    /**
     * @param activityId A unique integer value identifying this activity.
     * @param data
     * @returns Activity
     * @throws ApiError
     */
    public static activitiesUpdate(
        activityId: number,
        data: Activity,
    ): CancelablePromise<Activity> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/activities/{activity_id}/',
            path: {
                'activity_id': activityId,
            },
            body: data,
        });
    }
    /**
     * @param activityId A unique integer value identifying this activity.
     * @param data
     * @returns Activity
     * @throws ApiError
     */
    public static activitiesPartialUpdate(
        activityId: number,
        data: Activity,
    ): CancelablePromise<Activity> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/activities/{activity_id}/',
            path: {
                'activity_id': activityId,
            },
            body: data,
        });
    }
    /**
     * @param activityId A unique integer value identifying this activity.
     * @returns void
     * @throws ApiError
     */
    public static activitiesDelete(
        activityId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/activities/{activity_id}/',
            path: {
                'activity_id': activityId,
            },
        });
    }
}
