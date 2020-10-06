const API_VERSION = '1.0';

export class Routes {
	static NumScheduleLogs(scheduleId) { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/schedules/${scheduleId}/logs/count`; }
	static ScheduleLogs(scheduleId, page, count) { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/schedules/${scheduleId}/logs?page=${page}&count=${count}`; }
	static SetEnable(scheduleId, isEnabled) { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/schedules/${scheduleId}/enable/${isEnabled}`; }
}
