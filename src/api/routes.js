const API_VERSION = "1.0";

export class Routes {
	static ScheduleLogs(scheduleId, page, count) { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/logs/${scheduleId}/page?page=${page}&count=${count}`; }
	static NumScheduleLogs(scheduleId, page, count) { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/logs/${scheduleId}/count`; }
	static SetEnable(scheduleId, isEnabled) { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/schedules/${scheduleId}/enable/${isEnabled}`; }
}
