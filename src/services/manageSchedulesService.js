import { Scheduler } from '../api/scheduler';

export class ManageSchedulesService {

	static async addSchedule(schedule) {
		await Scheduler.addSchedule(schedule);
	}

	static async editSchedule(scheduleId, schedule) {
		await Scheduler.editSchedule(scheduleId, schedule);
	}

	static async getSchedule(scheduleId) {
		return await Scheduler.getSchedule(scheduleId);
	}

	static async setEnable(scheduleId, isEnabled) {
		return await Scheduler.setEnable(scheduleId, isEnabled);
	}

	static async runNow(scheduleId) {
		return await Scheduler.runNow(scheduleId);
	}

}
