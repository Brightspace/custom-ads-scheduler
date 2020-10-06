import { Routes } from './routes';

export class Scheduler {

	// API Routes

	static getLogs(scheduleId, page, count) {
		return this._get(Routes.ScheduleLogs(scheduleId, page, count));
	}

	static getNumLogs(scheduleId) {
		return this._get(Routes.NumScheduleLogs(scheduleId));
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

}
