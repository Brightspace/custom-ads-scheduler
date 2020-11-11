import { ScheduleLogsDemoService } from './scheduleLogsDemoService';
import { ScheduleLogsService } from './scheduleLogsService';

export class ScheduleLogsServiceFactory {
	static getScheduleLogsService() {
		if (window.demo) {
			return ScheduleLogsDemoService;
		}
		return ScheduleLogsService;
	}
}
