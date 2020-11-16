import { Scheduler } from '../api/scheduler';

export class ScheduleLogsService {

	static async getLogs(scheduleId, pageNumber, pageSize) {
		const logs = await Scheduler.getLogs(scheduleId, pageNumber, pageSize);
		return logs;
	}

	static async getNumLogs(scheduleId) {
		const numLogs = await Scheduler.getNumLogs(scheduleId);
		return numLogs;
	}
}
