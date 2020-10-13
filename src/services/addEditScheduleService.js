import { Scheduler } from '../api/scheduler';

export class AddEditScheduleService {

	static async getAdvancedDataSets() {
		const dataSets = await Scheduler.getDataSets();
		return dataSets.filter(ds => {
			return ds.Category && ds.Category === 'AdvancedDataSets';
		});
	}

}
