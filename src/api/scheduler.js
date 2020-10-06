import { Routes } from "./routes";

export class Scheduler {

	// API Routes

	static getLogs(scheduleId, page, count) {
		return this._get(Routes.ScheduleLogs(scheduleId, page, count));
	}

	static getNumLogs(scheduleId) {
		return this._get(Routes.NumScheduleLogs(scheduleId));
	}

	static setEnable(scheduleId, isEnabled) {
		return this._put(Routes.SetEnable(scheduleId, isEnabled));
	}

	// Helper Methods

	static _get(url) {
		let options = this._options("GET");
		return fetch(url, options).then(r => r.json());
	}

	static _post(url, body) {
		let options = this._options("POST");
		options.body = body;
		return fetch(url, options).then(r => r.json());
	}

	static _put(url, body) {
		let options = this._options("PUT");
		options.body = body;
		return fetch(url, options);
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

}
