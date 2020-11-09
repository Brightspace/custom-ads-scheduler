import { frequenciesEnum, typesEnum } from '../constants';

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export class ManageSchedulesDemoService {

	static nextScheduleId = 3;

	static schedules = [

		{
			scheduleId: '30C5DBC7-06CF-4FCF-89D8-02A3C5F255B1',
			name: 'ADS Schedule A',
			typeId: typesEnum.diff,
			frequencyId: frequenciesEnum.mins15,
			startDate: '2020-10-20T15:00:50.033',
			endDate: '2020-10-20T15:00:50.033',
			isEnabled: true,
			dataSetId: 'a0e3aca7-3bf2-4400-b831-9fdce98469b1',
			orgId: 1,
			preferredTime: '15:00:50.010000',
			userId: '1212',
			orgUnitId: '6606',
			roleIds: '595,578',
			deliveryTypeId: 1,
			filePath: 'Folder1'
		},
		{
			scheduleId: '30C5DBC7-06CF-4FCF-89D8-02A3C5F255B2',
			name: 'ADS Schedule B',
			typeId: typesEnum.full,
			frequencyId: frequenciesEnum.weekly,
			startDate: '2020-10-20T15:00:50.033',
			endDate: '2020-10-20T15:00:50.033',
			isEnabled: false,
			dataSetId: 'a0e3aca7-3bf2-4400-b831-9fdce98469b2',
			orgId: 1,
			preferredTime: '15:00:50',
			userId: '1212',
			orgUnitId: '6607',
			roleIds: '595',
			deliveryTypeId: 2,
			filePath: 'Folder2'
		},
	];

	static async addSchedule(schedule) {
		const deepCopy = JSON.parse(JSON.stringify(schedule));
		deepCopy.scheduleId = `'a0e3aca7-3bf2-4400-b831-9fdce98469b${this.nextScheduleId}`;
		this.nextScheduleId++;
		await this.schedules.push(deepCopy);
		this._logSchedules();
	}

	static async editSchedule(scheduleId, schedule) {
		const existingScheduleIndex = this.schedules.findIndex(s => s.scheduleId === scheduleId);
		if (existingScheduleIndex >= 0) {
			this.schedules[existingScheduleIndex] = schedule;
		}
		this._logSchedules();
	}

	static async getSchedule(scheduleId) {
		if (window.shouldWait) {
			await sleep(2000);
		}
		return this.schedules.find(schedule => schedule.scheduleId === scheduleId);
	}

	static _logSchedules() {
		window.console.log('Demo Schedules Service - Saved Schedules', this.schedules);
	}
}
