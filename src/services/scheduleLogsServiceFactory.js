import { ScheduleLogsDemoService } from './scheduleLogsDemoService';
// import { ScheduleLogsService } from './scheduleLogsService';

export class ScheduleLogsServiceFactory {
	static getScheduleLogsService() {

		// Until we have a working backend to query, just use the Demo Service
		return ScheduleLogsDemoService;

		// TODO: re-enable once we have a real backend to query
		// if (window.demo) {
		// 	return ScheduleLogsDemoService;
		// }
		// return ScheduleLogsService;
	}
}
