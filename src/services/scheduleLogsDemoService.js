function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export class ScheduleLogsDemoService {

	static allLogs = [
		{
			scheduleId: 1,
			runDate: '2020-09-01T00:00:00',
			endDate: '2020-09-01T00:00:00',
			statusId: 4
		},
		{
			scheduleId: 2,
			runDate: '2020-09-02T00:00:00',
			endDate: '2020-09-02T00:00:00',
			statusId: 3
		},
		{
			scheduleId: 3,
			runDate: '2020-09-04T00:00:00',
			endDate: '2020-09-04T00:00:00',
			statusId: 3
		},
		{
			scheduleId: 4,
			runDate: '2020-09-03T00:00:00',
			endDate: '2020-09-03T00:00:00',
			statusId: 2
		},
		{
			scheduleId: 5,
			runDate: '2020-09-06T00:00:00',
			endDate: '2020-09-06T00:00:00',
			statusId: 3
		},
		{
			scheduleId: 6,
			runDate: '2020-09-05T00:00:00',
			endDate: '2020-09-05T00:00:00',
			statusId: 3
		},
		{
			scheduleId: 7,
			runDate: '2020-09-07T00:00:00',
			endDate: '2020-09-07T00:00:00',
			statusId: 1
		},
		{
			scheduleId: 8,
			runDate: '2020-09-09T00:00:00',
			endDate: '2020-09-09T00:00:00',
			statusId: 3
		},
		{
			scheduleId: 9,
			runDate: '2020-09-08T00:00:00',
			endDate: '2020-09-08T00:00:00',
			statusId: 3
		},
		{
			scheduleId: 10,
			runDate: '2020-09-11T00:00:00',
			endDate: '2020-09-11T00:00:00',
			statusId: 4
		},
		{
			scheduleId: 11,
			runDate: '2020-09-12T00:00:00',
			endDate: '2020-09-12T00:00:00',
			statusId: 3
		},
		{
			scheduleId: 12,
			runDate: '2020-09-13T00:00:00',
			endDate: '2020-09-13T00:00:00',
			statusId: 3
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
				if (a.runDate < b.runDate)
					return 1;
				else if (b.runDate < a.runDate)
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
