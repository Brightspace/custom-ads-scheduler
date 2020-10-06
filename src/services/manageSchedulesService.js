import { Scheduler } from "../api/scheduler";

export class ManageSchedulesService {
	static async setEnable(scheduleId, isEnabled) {
		return await Scheduler.setEnable(scheduleId, isEnabled);
	}
}
