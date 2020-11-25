import { Routes } from './routes';

export class Scheduler {

	// API Routes

	static async addSchedule(schedule) {
		return await this._post(Routes.NewSchedule(), JSON.stringify(schedule));
	}

	static async editSchedule(scheduleId, schedule) {
		return await this._put(Routes.ExistingSchedule(scheduleId), JSON.stringify(schedule));
	}

	static async getDataSets() {
		return await this._get(Routes.DataSets());
	}

	static async getLogs(scheduleId, pageNumber, pageSize) {
		return await this._get(Routes.ScheduleLogs(scheduleId, pageNumber, pageSize));
	}

	static async getNumLogs(scheduleId) {
		return await this._get(Routes.NumScheduleLogs(scheduleId));
	}

	static async getRoleItems(orgUnitId) {
		return await this._get(Routes.RoleItems(orgUnitId));
	}

	static async getSchedule(scheduleId) {
		return await this._get(Routes.ExistingSchedule(scheduleId));
	}

	static async setEnable(scheduleId, isEnabled) {
		return await this._put(Routes.SetEnable(scheduleId, isEnabled));
	}

	static async runNow(scheduleId) {
		return await this._put(Routes.RunNow(scheduleId));
	}

	// Helper Methods

	static async _fetch(url, options) {
		return await fetch(url, options)
			.then(response => {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				return response;
			});
	}

	static _get(url) {
		const options = this._options('GET');
		return this._fetch(url, options).then(r => r.json());
	}

	static _options(method) {
		return {
			credentials: 'include',
			headers: new Headers({
				'Access-Control-Allow-Origin': '*',
				'X-Csrf-Token': this._xsrfToken
			}),
			method: method,
			mode: 'cors',
		};
	}

	static _post(url, body) {
		const options = this._options('POST');
		options.body = body;
		return this._fetch(url, options);
	}

	static _put(url, body) {
		const options = this._options('PUT');
		options.body = body;
		return this._fetch(url, options);
	}

	static get _xsrfToken() {
		return  D2L && D2L.LP && D2L.LP.Web && D2L.LP.Web.Authentication &&
		D2L.LP.Web.Authentication.Xsrf &&
		D2L.LP.Web.Authentication.Xsrf.GetXsrfToken &&
		D2L.LP.Web.Authentication.Xsrf.GetXsrfToken() || '';
	}

}
