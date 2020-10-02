import { Scheduler } from "../api/scheduler";

export class ScheduleLogsService {

	static async getLogs(scheduleId, page, count) {
		let logs = await Scheduler.getLogs(scheduleId, page, count);
		return logs;
	}

	static async getNumLogs(scheduleId) {
		let numLogs = await Scheduler.getNumLogs(scheduleId);
		return numLogs;
	}
}
