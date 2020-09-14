export class ManageSchedulesTestService {
	constructor(patches) {
		this.getManageSchedulesService = async() => [];

		if (patches) {
			for (const [functionName, patch] of Object.entries(patches)) {
				this[functionName] = patch;
			}
		}
	}
}
