import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
import '@brightspace-ui-labs/pagination/pagination.js';
import { bodyStandardStyles, heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { d2lTableStyles } from '../styles/d2lTableStyles';
import { formatDateTime } from '@brightspace-ui/intl/lib/dateTime';
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
			scheduleName: {
				type: String,
				attribute: 'schedule-name'
			},
			page: {
				type: Number
			},
			maxPage: {
				type: Number
			},
			pageCount: {
				type: Number
			},
			pageCountOptions: {
				type: Array
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
				width: 100%;
				display: inline-block;
			}

			:host([hidden]) {
				display: none;
			}

			.spinner {
				display: flex;
				margin: 48px;
			}

			.table-wrapper {
				position: relative;
			}

			.query-spinner {
				position: absolute;
				left: 0px;
				width: 100%;
				margin: 0px auto;
				top: calc(50% - 50px);
			}

			.description-text {
				margin-bottom: 10px;
			}

			.manage-schedules-button {
				margin-bottom: 12px;
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
		this.scheduleName = '';
		this.logs = Array();
		this.page = 1;
		this.maxPage = 1;
		this.pageCount = 10;

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
		this.paginationElement = this.shadowRoot.getElementById('log-pagination');
		this.paginationElement?.addEventListener('pagination-page-change', this._handlePageChange);
		this.paginationElement?.addEventListener('pagination-item-counter-change', this._handleItemsPerPageChange);
	}

	async disconnectedCallback() {
		this.paginationElement?.removeEventListener('pagination-page-change', this._handlePageChange);
		this.paginationElement?.removeEventListener('pagination-item-counter-change', this._handleItemsPerPageChange);
	}

	async _queryNumLogs() {
		const numLogs = await this.scheduleLogsService.getNumLogs(this.scheduleId);
		this.maxPage = Math.ceil(numLogs / this.pageCount);
	}

	async _queryLogs() {
		this.isQuerying = true;

		const logs = await this.scheduleLogsService.getLogs(this.scheduleId, this.page, this.pageCount);
		this._mapLogsArray(logs);

		this.isQuerying = false;
	}

	_mapLogsArray(logsArray) {
		if (logsArray) {

			// Enforce our page size on the client side as well, just in case
			this.logs = logsArray.slice(0, this.pageCount);
		}
	}

	_handlePageChange(event) {
		this.page = event.detail.page;
		this._queryLogs();
	}

	_handleItemsPerPageChange(event) {

		// Update the page count and total # of logs
		this.pageCount = event.detail.itemCount;
		this._queryNumLogs();

		// If the number of total logs and the new page size no longer support the current page, adjust it
		this.page = Math.min(this.page, this.maxPage);

		// Re-query the page of logs with new pagination values
		this._queryLogs();
	}

	_handleReturnToManageSchedules() {
		window.location.href = '/d2l/custom/ads/scheduler/manageSchedules';
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
			<d2l-button
				primary
				class="manage-schedules-button"
				@click=${ this._handleReturnToManageSchedules }>
					${ this.localize('logs.manageSchedules') }
			</d2l-button>
		`;

		return html`
			${ baseTemplate }
			${ this._renderTable() }
			${ this._renderPagination() }
		`;
	}

	_renderTable() {
		return html`
			<div class="table-wrapper">
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
				${this.isQuerying ? this._renderQuerySpinner() : ''}
			</div>
		`;
	}

	_renderQuerySpinner() {
		return html`
			<d2l-loading-spinner
				class="query-spinner"
				size=100>
			</d2l-loading-spinner>
		`;
	}

	_renderPagination() {
		return html`
			<d2l-labs-pagination
				id="log-pagination"
				page-number="${ this.page }"
				max-page-number="${ this.maxPage }"
				show-item-count-select
				item-count-options="[10, 25, 50]"
				selected-count-option="${ this.pageCount }"
				@pagination-page-change="${ this._handlePageChange }"
				@pagination-item-counter-change="${ this._handleItemsPerPageChange }"></d2l-labs-pagination>
		`;
	}

	_formatDateTime(dateTime) {
		return formatDateTime(dateTime, { format: 'short' });
	}

	_renderLog(log) {
		return html`
			<tr>
				<td>
					${ this._formatDateTime(log.RunDate) }
				</td>
				<td>
					${ this._formatDateTime(log.EndDate) }
				</td>
				<td>
					${ log.StatusName }
				</td>
			</tr>
		`;
	}
}

customElements.define('d2l-schedule-logs', ScheduleLogs);
