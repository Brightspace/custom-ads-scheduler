const API_VERSION = '1.0';
const DS_API_VERSION = '1.28';

export class Routes {
	static DataSets() { return `/d2l/api/lp/${DS_API_VERSION}/dataExport/list`; }
	static GetSchedule(scheduleId) { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/schedules/${scheduleId}`; }
	static NumScheduleLogs(scheduleId) { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/schedules/${scheduleId}/logs/count`; }
	static RoleItems() { return `/d2l/api/lp/${DS_API_VERSION}/roles/`; }
	static ScheduleLogs(scheduleId, page, count) { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/schedules/${scheduleId}/logs?page=${page}&count=${count}`; }
	static SetEnable(scheduleId, isEnabled) { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/schedules/${scheduleId}/enable/${isEnabled}`; }
}
