function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export class ManageSchedulesDemoService {
	static async getSchedules(tempShouldHaveSchdules) {
		if (window.shouldWait) {
			await sleep(2000);
		}
		let schedules;
		if (window.shouldBeEmpty || !tempShouldHaveSchdules) {
			schedules = [];
		} else {
			schedules = [
				{
					name: 'A',
					type: 'Differential',
					frequency: 'Daily',
					startDate: '09/01/2020',
					endDate: '12/31/2020',
					enabled: true
				},
				{
					name: 'B',
					type: 'Full',
					frequency: 'Weekly',
					startDate: '09/01/2020',
					endDate: '12/31/2020',
					enabled: false
				},
			];
		}
		return schedules;
	}
}
