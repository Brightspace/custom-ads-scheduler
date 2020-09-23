function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export class ManageSchedulesDemoService {

	static schedules = [
		{
			name: 'A',
			type: 'Differential',
			frequency: 'Daily',
			startDate: '09/01/2020',
			endDate: '12/31/2020',
			enabled: true,
			scheduleId: 1
		},
		{
			name: 'B',
			type: 'Full',
			frequency: 'Weekly',
			startDate: '09/01/2020',
			endDate: '12/31/2020',
			enabled: false,
			scheduleId: 2
		},
	];

	static async getSchedule(scheduleId) {
		if (window.shouldWait) {
			await sleep(2000);
		}
		return this.schedules.find(schedule => schedule.scheduleId = scheduleId);
	}

	static async getSchedules(tempShouldHaveSchdules) {
		if (window.shouldWait) {
			await sleep(2000);
		}
		if (window.shouldBeEmpty || !tempShouldHaveSchdules) {
			return [];
		}
		return this.schedules;
	}
}
