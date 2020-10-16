import { Routes } from './routes';

export class Scheduler {

	// API Routes

	static addSchedule(schedule) {
		return this._post(Routes.NewSchedule(), schedule);
	}

	static editSchedule(scheduleId, schedule) {
		return this._put(Routes.ExistingSchedule(scheduleId), JSON.stringify(schedule));
	}

	static getDataSets() {
		return this._get(Routes.DataSets());
	}

	static getLogs(scheduleId, page, count) {
		return this._get(Routes.ScheduleLogs(scheduleId, page, count));
	}

	static getNumLogs(scheduleId) {
		return this._get(Routes.NumScheduleLogs(scheduleId));
	}

	static getSchedule(scheduleId) {
		return this._get(Routes.ExistingSchedule(scheduleId));
	}

	static setEnable(scheduleId, isEnabled) {
		return this._put(Routes.SetEnable(scheduleId, isEnabled));
	}

	// Helper Methods

	static _get(url) {
		const options = this._options('GET');
		return fetch(url, options).then(r => r.json());
	}

	static _options(method) {
		return {
			credentials: 'include',
			headers: new Headers({
				'Access-Control-Allow-Origin': '*',
			}),
			method: method,
			mode: 'cors',
		};
	}

	static _post(url, body) {
		const options = this._options('POST');
		options.body = body;
		return fetch(url, options).then(r => r.json());
	}

	static _put(url, body) {
		const options = this._options('PUT');
		options.body = body;
		return fetch(url, options);
	}

}
