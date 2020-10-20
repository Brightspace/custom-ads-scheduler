import { frequenciesEnum, typesEnum } from '../constants';

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export class ManageSchedulesDemoService {

	static schedules = [
		{
			name: 'ADS Schedule A',
			type: typesEnum.diff,
			frequency: frequenciesEnum.mins15,
			startDate: '09/01/2020',
			endDate: '12/31/2020',
			isEnabled: true,
			scheduleId: 1,
			dataSetId: 'a0e3aca7-3bf2-4400-b831-9fdce98469b1',
			orgUnitId: '6606',
			roleIds: '595,578'
		},
		{
			name: 'ADS Schedule B',
			typeId: typesEnum.full,
			frequencyId: frequenciesEnum.weekly,
			startDate: '09/01/2020',
			endDate: '12/31/2020',
			isEnabled: false,
			scheduleId: 2,
			dataSetId: 'a0e3aca7-3bf2-4400-b831-9fdce98469b2',
			orgUnitId: '6607',
			roleIds: '595'
		},
	];

	static async getSchedule(scheduleId) {
		if (window.shouldWait) {
			await sleep(2000);
		}
		return this.schedules.find(schedule => schedule.scheduleId = scheduleId);
	}
}
