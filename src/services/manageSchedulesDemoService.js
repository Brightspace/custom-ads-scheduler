import { frequenciesEnum, typesEnum } from '../constants';

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export class ManageSchedulesDemoService {

	static schedules = [
		{
			name: 'A',
			type: typesEnum.diff,
			frequency: frequenciesEnum.mins15,
			startDate: '09/01/2020',
			endDate: '12/31/2020',
			isEnabled: true,
			scheduleId: 1,
			dataSetId: 'FEDCBA'
		},
		{
			name: 'B',
			typeId: typesEnum.full,
			frequencyId: frequenciesEnum.weekly,
			startDate: '09/01/2020',
			endDate: '12/31/2020',
			isEnabled: false,
			scheduleId: 2,
			dataSetId: 'ABCDEF'
		},
	];

	static async getSchedule(scheduleId) {
		if (window.shouldWait) {
			await sleep(2000);
		}
		return this.schedules.find(schedule => schedule.scheduleId = scheduleId);
	}
}
