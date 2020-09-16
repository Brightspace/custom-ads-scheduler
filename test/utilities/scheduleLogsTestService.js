export class ScheduleLogsTestService {
	constructor(patches) {

		if (patches) {
			for (const [functionName, patch] of Object.entries(patches)) {
				this[functionName] = patch;
			}
		}
	}
}
