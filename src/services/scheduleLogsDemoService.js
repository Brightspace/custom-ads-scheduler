function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export class ScheduleLogsDemoService {

	static allLogs = [
		{
			ScheduleId: 1,
			RunDate: new Date(2020, 9, 11, 1, 2, 3),
			EndDate: new Date(2020, 9, 15, 1, 4, 17),
			StatusName: 'Completed'
		},
		{
			ScheduleId: 2,
			RunDate: new Date(2020, 9, 10, 2, 2, 16),
			EndDate: new Date(2020, 9, 17, 2, 18, 29),
			StatusName: 'Failed'
		},
		{
			ScheduleId: 3,
			RunDate: new Date(2020, 9, 12, 11, 15, 0),
			EndDate: new Date(2020, 9, 1, 11, 30, 29),
			StatusName: 'Failed'
		},
		{
			ScheduleId: 4,
			RunDate: new Date(2020, 9, 30, 1, 2, 3),
			EndDate: new Date(2020, 9, 15, 1, 4, 17),
			StatusName: 'Completed'
		},
		{
			ScheduleId: 5,
			RunDate: new Date(2020, 9, 5, 2, 2, 16),
			EndDate: new Date(2020, 9, 17, 2, 18, 29),
			StatusName: 'Failed'
		},
		{
			ScheduleId: 6,
			RunDate: new Date(2020, 9, 7, 11, 15, 0),
			EndDate: new Date(2020, 9, 1, 11, 30, 29),
			StatusName: 'Failed'
		},
		{
			ScheduleId: 7,
			RunDate: new Date(2020, 9, 8, 1, 2, 3),
			EndDate: new Date(2020, 9, 15, 1, 4, 17),
			StatusName: 'Completed'
		},
		{
			ScheduleId: 8,
			RunDate: new Date(2020, 9, 11, 2, 2, 16),
			EndDate: new Date(2020, 9, 17, 2, 18, 29),
			StatusName: 'Failed'
		},
		{
			ScheduleId: 9,
			RunDate: new Date(2020, 9, 26, 11, 15, 0),
			EndDate: new Date(2020, 9, 1, 11, 30, 29),
			StatusName: 'Failed'
		},
		{
			ScheduleId: 10,
			RunDate: new Date(2020, 9, 30, 1, 2, 3),
			EndDate: new Date(2020, 9, 15, 1, 4, 17),
			StatusName: 'Completed'
		},
		{
			ScheduleId: 11,
			RunDate: new Date(2020, 9, 3, 2, 2, 16),
			EndDate: new Date(2020, 9, 17, 2, 18, 29),
			StatusName: 'Failed'
		},
		{
			ScheduleId: 12,
			RunDate: new Date(2020, 9, 6, 11, 15, 0),
			EndDate: new Date(2020, 9, 1, 11, 30, 29),
			StatusName: 'Failed'
		}
	];

	// NOTE: Assumes 1-based page index
	static async getLogs(scheduleId, page, pageSize) {
		if (window.shouldWait) {
			await sleep(2000);
		}
		if (window.shouldBeEmpty) {
			return [];
		} else {

			// Mock query logic that will be in the LMS
			// Probably overkill for a demo, but it is compelling to see working pagination!

			// Determine start index - Protect against querying a larger page index than allowed
			const maxStartIndex = Math.floor(this.allLogs.length / pageSize) * pageSize;
			const startIndex = Math.min((page - 1) * pageSize, maxStartIndex);

			// Determine end index & return sorted query result
			const endIndex = Math.min(startIndex + pageSize, this.allLogs.length);
			return this.allLogs.sort((a, b) => {
				if (a.RunDate < b.RunDate)
					return 1;
				else if (b.RunDate < a.RunDate)
					return -1;
				else
					return 0;
			}).slice(startIndex, endIndex);
		}
	}

	static async getNumLogs() {
		return this.allLogs.length;
	}
}
