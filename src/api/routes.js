const API_VERSION = '1.0';
const DS_API_VERSION = '1.28';

export class Routes {
	static DataSets() { return `/d2l/api/lp/${DS_API_VERSION}/dataExport/list`; }
	static ExistingSchedule(scheduleId) { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/schedules/${scheduleId}`; }
	static NewSchedule() { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/schedules`; }
	static NumScheduleLogs(scheduleId) { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/schedules/${scheduleId}/logs/count`; }
	static RoleItems() { return `/d2l/api/lp/${DS_API_VERSION}/roles/`; }
	static ScheduleLogs(scheduleId, pageNumber, pageSize) { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/schedules/${scheduleId}/logs?pageNumber=${pageNumber}&pageSize=${pageSize}`; }
	static SetEnable(scheduleId, isEnabled) { return `/d2l/api/customization/${API_VERSION}/ads/scheduler/schedules/${scheduleId}/enable/${isEnabled}`; }
}
