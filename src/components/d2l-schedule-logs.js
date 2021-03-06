import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
import '@brightspace-ui-labs/pagination/pagination.js';
import { bodyStandardStyles, heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { d2lTableStyles } from '../styles/d2lTableStyles';
import { formatDateTime } from '@brightspace-ui/intl/lib/dateTime';
import { getLocalDateTimeFromUTCDateTimeString } from '../dateTime';
import { getLocalizeResources } from '../localization.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { ScheduleLogsServiceFactory } from '../services/scheduleLogsServiceFactory';
import { statuses } from '../constants';

class ScheduleLogs extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			scheduleId: {
				type: String,
				attribute: 'schedule-id'
			},
			scheduleName: {
				type: String,
				attribute: 'schedule-name'
			},
			pageNumber: {
				type: Number
			},
			maxPage: {
				type: Number
			},
			pageSize: {
				type: Number
			},
			logs: {
				type: Array
			},
			scheduleLogsService: {
				type: Object
			},
			isLoading: {
				type: Boolean
			},
			isQuerying: {
				type: Boolean
			}
		};
	}

	static get styles() {
		const scheduleLogsStyles = css`
			:host {
				display: inline-block;
				width: 100%;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-spinner {
				display: flex;
				margin: 48px;
			}

			.d2l-table-wrapper {
				position: relative;
			}

			.d2l-dimmed {
				opacity: 0.6;
			}

			.d2l-query-spinner {
				left: 0;
				margin: 0 auto;
				position: absolute;
				top: calc(50% - 50px);
				width: 100%;
			}

			.d2l-description-text {
				margin-bottom: 18px;
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
		this.scheduleName = '';
		this.logs = Array();
		this.pageNumber = 1;
		this.maxPage = 1;
		this.pageSize = 10;

		this.scheduleLogsService = ScheduleLogsServiceFactory.getScheduleLogsService();

		this.isLoading = true;
		this.isQuerying = false;
	}

	async connectedCallback() {
		super.connectedCallback();

		this.isLoading = true;

		await this._queryNumLogs();
		await this._queryLogs();

		this.isLoading = false;

		this.requestUpdate();
	}

	render() {
		return html`
			${ this.isLoading ? this._renderSpinner() : this._renderLogs() }
		`;
	}

	_formatDateTime(dateTime) {
		return dateTime === null
			? this.localize('unavailableDate')
			: formatDateTime(dateTime, { format: 'short' });
	}

	async _handleItemsPerPageChange(event) {

		// Update the page count and total # of logs
		this.pageSize = event.detail.itemCount;
		await this._queryNumLogs();

		// If the number of total logs and the new page size no longer support the current page, adjust it
		this.pageNumber = Math.min(this.pageNumber, this.maxPage);

		// Re-query the page of logs with new pagination values
		await this._queryLogs();
	}

	async _handlePageChange(event) {
		this.pageNumber = event.detail.page;
		await this._queryLogs();
	}

	_handleReturnToManageSchedules() {
		window.location.href = '/d2l/custom/ads/scheduler/manage';
	}

	_mapLogsArray(logsArray) {
		if (logsArray) {

			// Enforce our page size on the client side as well, just in case
			this.logs = logsArray.slice(0, this.pageSize);
		}
	}

	_parseStatus(statusId) {
		return this.localize(`schedule.status.${statuses[statusId]}`) || '';
	}

	async _queryLogs() {
		this.isQuerying = true;

		const logs = await this.scheduleLogsService.getLogs(this.scheduleId, this.pageNumber, this.pageSize);

		// UTC -> Local DateTime conversion
		logs.forEach(log => {
			if (log.runDate)
				log.runDate = getLocalDateTimeFromUTCDateTimeString(log.runDate);

			if (log.endDate)
				log.endDate = getLocalDateTimeFromUTCDateTimeString(log.endDate);
		});

		this._mapLogsArray(logs);

		this.isQuerying = false;
	}

	async _queryNumLogs() {
		const numLogs = await this.scheduleLogsService.getNumLogs(this.scheduleId);
		this.maxPage = Math.max(Math.ceil(numLogs / this.pageSize), 1);
	}

	_renderLog(log) {
		return html`
			<tr>
				<td>
					${ this._formatDateTime(log.runDate) }
				</td>
				<td>
					${ this._formatDateTime(log.endDate) }
				</td>
				<td>
					${ this._parseStatus(log.statusId) }
				</td>
			</tr>
		`;
	}

	_renderLogs() {
		const baseTemplate = html`

			<div class="d2l-description-text d2l-body-standard">
				${ this.localize('logs.desc', { scheduleId:`${this.scheduleId}` }) }
			</div>
		`;

		return html`
			${ baseTemplate }
			${ this._renderTable() }
			${ this._renderPagination() }
		`;
	}

	_renderPagination() {
		return html`
			<d2l-labs-pagination
				id="log-pagination"
				page-number="${ this.pageNumber }"
				max-page-number="${ this.maxPage }"
				show-item-count-select
				item-count-options="[10, 25, 50]"
				selected-count-option="${ this.pageSize }"
				@pagination-page-change="${ this._handlePageChange }"
				@pagination-item-counter-change="${ this._handleItemsPerPageChange }"></d2l-labs-pagination>
		`;
	}

	_renderQuerySpinner() {
		return html`
			<d2l-loading-spinner
				class="d2l-query-spinner"
				size=100>
			</d2l-loading-spinner>
		`;
	}

	_renderSpinner() {
		return html`
			<d2l-loading-spinner
				class="d2l-spinner"
				size=100>
			</d2l-loading-spinner>
		`;
	}

	_renderTable() {
		return html`
			<div class="d2l-table-wrapper ${ this.isQuerying ? 'd2l-dimmed' : '' }">
				<table>
					<thead>
						<th>${ this.localize('logs.runDate') }</th>
						<th>${ this.localize('logs.completionDate') }</th>
						<th>${ this.localize('logs.completionStatus') }</th>
					</thead>
					<tbody>
						${ this.logs.map(log => this._renderLog(log)) }
					</tbody>
				</table>
				${ this.isQuerying ? this._renderQuerySpinner() : '' }
			</div>
		`;
	}

}

customElements.define('d2l-schedule-logs', ScheduleLogs);
