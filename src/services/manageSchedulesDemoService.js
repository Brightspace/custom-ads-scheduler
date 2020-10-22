import { frequenciesEnum, typesEnum } from '../constants';

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export class ManageSchedulesDemoService {

	static nextScheduleId = 3;

	static schedules = [

		{
			scheduleId: 1,
			name: 'ADS Schedule A',
			type: typesEnum.diff,
			frequencyId: frequenciesEnum.mins15,
			startDate: '2020-10-20T15:00:50.033',
			endDate: '2020-10-20T15:00:50.033',
			isEnabled: true,
			dataSetId: 'a0e3aca7-3bf2-4400-b831-9fdce98469b1',
			orgId: 1,
			preferredTime: '15:00:50.010000',
			orgUnitId: '6606',
			roleIds: '595,578'
		},
		{
			scheduleId: 2,
			name: 'ADS Schedule B',
			typeId: typesEnum.full,
			frequencyId: frequenciesEnum.weekly,
			startDate: '2020-10-20T15:00:50.033',
			endDate: '2020-10-20T15:00:50.033',
			isEnabled: false,
			dataSetId: 'a0e3aca7-3bf2-4400-b831-9fdce98469b2',
			orgId: 1,
			preferredTime: '15:00:50',
			orgUnitId: '6607',
			roleIds: '595'
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
