function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export class ManageSchedulesDemoService {

	static schedules = [
		{
			name: 'A',
			type: 2,
			frequency: 4,
			startDate: '09/01/2020',
			endDate: '12/31/2020',
			isEnabled: true,
			scheduleId: 1
		},
		{
			name: 'B',
			typeId: 1,
			frequencyId: 1,
			startDate: '09/01/2020',
			endDate: '12/31/2020',
			isEnabled: false,
			scheduleId: 2
		},
	];

	static async getSchedule(scheduleId) {
		if (window.shouldWait) {
			await sleep(2000);
		}
		return this.schedules.find(schedule => schedule.scheduleId = scheduleId);
	}
}
