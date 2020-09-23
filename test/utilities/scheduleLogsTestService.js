export class ScheduleLogsTestService {
	constructor(patches) {
		this.getScheduleLogsService = async() => [];

		if (patches) {
			for (const [functionName, patch] of Object.entries(patches)) {
				this[functionName] = patch;
			}
		}
	}
}
