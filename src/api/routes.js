const API_VERSION = "1.0";

export class Routes {
	static ScheduleLogs(scheduleId, page, count) { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/schedules/${scheduleId}/logs?page=${page}&count=${count}`; }
	static NumScheduleLogs(scheduleId) { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/schedules/${scheduleId}/logs/count`; }
}
