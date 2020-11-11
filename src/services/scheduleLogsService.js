import { Scheduler } from '../api/scheduler';

export class ScheduleLogsService {

	static async getLogs(scheduleId, page, count) {
		const logs = await Scheduler.getLogs(scheduleId, page, count);
		return logs;
	}

	static async getNumLogs(scheduleId) {
		const numLogs = await Scheduler.getNumLogs(scheduleId);
		return numLogs;
	}
}
