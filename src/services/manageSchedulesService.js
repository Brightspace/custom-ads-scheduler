import { Scheduler } from '../api/scheduler';

export class ManageSchedulesService {

	static async getSchedule(/* scheduleId */) {
		// TODO: Hook up to Syeda's schedule API
		return {};
	}

	static async setEnable(scheduleId, isEnabled) {
		return await Scheduler.setEnable(scheduleId, isEnabled);
	}

}
