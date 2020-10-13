import { Scheduler } from '../api/scheduler';

export class ManageSchedulesService {

	static async getSchedule(scheduleId) {
		return await Scheduler.getSchedule(scheduleId);
	}

	static async setEnable(scheduleId, isEnabled) {
		return await Scheduler.setEnable(scheduleId, isEnabled);
	}

}
