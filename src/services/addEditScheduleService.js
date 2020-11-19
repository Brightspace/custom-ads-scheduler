import { Scheduler } from '../api/scheduler';

export class AddEditScheduleService {

	static async getAdvancedDataSets() {
		const result = await Scheduler.getDataSets();
		if (result.status === 403) {
			window.console.error(result.detail);
			return [];
		}
		return result.filter(ds => {
			return ds.Category && ds.Category === 'AdvancedDataSets';
		});
	}

	static async getRoles(orgUnitId) {
		return await Scheduler.getRoleItems(orgUnitId);
	}

}
