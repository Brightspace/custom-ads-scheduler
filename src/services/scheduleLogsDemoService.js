function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export class ScheduleLogsDemoService {
	static async getLogs() {
		if (window.shouldWait) {
			await sleep(2000);
		}
		let logs;
		if (window.shouldBeEmpty) {
			logs = [];
		} else {
			logs = [
				{
					executionDate: '09/01/2020 02:00:03',
					completionStatus: 'Completed Successfully'
				},
				{
					executionDate: '09/02/2020 04:14:17',
					completionStatus: 'Complete and Utter Failure'
				},
			];
		}
		return logs;
	}
}
