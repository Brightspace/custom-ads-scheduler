// import '@brightspace-ui/core/components/button/button';
// import '@brightspace-ui/core/components/button/button-subtle';
// import '@brightspace-ui/core/components/dropdown/dropdown';
// import '@brightspace-ui/core/components/dropdown/dropdown-context-menu';
// import '@brightspace-ui/core/components/dropdown/dropdown-menu';
// import '@brightspace-ui/core/components/icons/icon';
// import '@brightspace-ui/core/components/menu/menu';
// import '@brightspace-ui/core/components/menu/menu-item';
import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
// import './nothing-here-illustration';
import { bodyStandardStyles, heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { d2lTableStyles } from '../styles/d2lTableStyles';
import { getLocalizeResources } from '../localization.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { ScheduleLogsServiceFactory } from '../services/scheduleLogsServiceFactory';

class ScheduleLogs extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			scheduleId: {
				type: Number,
				attribute: 'schedule-id'
			},
			logs: {
				type: Array
			},
			scheduleLogsService: {
				type: Object
			},
			isLoading: {
				type: Boolean
			}
		};
	}

	static get styles() {
		const scheduleLogsStyles = css`
			:host {
				width: 100%;
				display: inline-block;
			}

			:host([hidden]) {
				display: none;
			}

			.add-new-button {
				padding: 6px 0px;
			}

			.spinner {
				display: flex;
				margin: 48px;
			}

			.description-text {
				margin-bottom: 10px;
			}

			.message--empty-table {
				text-align: center;
			}

			.d2l-heading-2.nothing-title {
				margin-top: 0;
				margin-bottom: 18px;
			}

			.empty-table-wrapper {
				display: flex;
				flex-direction: column;
			}

			.get-started-button {
				margin: 12px;
				align-self: center;
			}
		`;
		return [
			d2lTableStyles,
			scheduleLogsStyles,
			bodyStandardStyles,
			heading2Styles
		];
	}

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs);
	}

	constructor() {
		super();

		this.scheduleId = 0;

		this.scheduleLogsService = ScheduleLogsServiceFactory.getScheduleLogsService();

		this.logs = Array();

		this.isLoading = true;
	}

	async connectedCallback() {
		super.connectedCallback();

		this.isLoading = true;

		const logs = await this.scheduleLogsService.getLogs(this.scheduleId);
		this._mapLogsArray(logs);

		this.isLoading = false;
	}

	_mapLogsArray(logsArray) {
		if (logsArray) {
			this.logs = logsArray;
		}
	}

	// Rendering

	render() {
		return html`
			${ this.isLoading ? this._renderSpinner() : this._renderLogs() }
		`;
	}

	_renderSpinner() {
		return html`
			<d2l-loading-spinner
				class="spinner"
				size=100>
			</d2l-loading-spinner>
		`;
	}

	_renderLogs() {
		const baseTemplate = html`
			<div class="description-text d2l-body-standard">
				${ this.localize('logs.desc', { scheduleId:`${this.scheduleId}` }) }
			</div>
		`;

		return html`
			${ baseTemplate }
			${ this._renderTable() }
		`;
	}

	_renderTable() {
		return html`
			<table>
				<thead>
					<th>${ this.localize('logs.executionDate') }</th>
					<th>${ this.localize('logs.completionStatus') }</th>
				</thead>
				<tbody>
					${ this.logs.map(log => this._renderLog(log)) }
				</tbody>
			</table>
		`;
	}

	_renderLog(log) {
		return html`
			<tr>
				<td>
					${log.executionDate}
				</td>
				<td>
					${log.completionStatus}
				</td>
			</tr>
		`;
	}
}

customElements.define('d2l-schedule-logs', ScheduleLogs);
