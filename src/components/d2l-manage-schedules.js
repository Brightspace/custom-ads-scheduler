import '@brightspace-ui/core/components/alert/alert-toast';
import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/button/button-subtle';
import '@brightspace-ui/core/components/dropdown/dropdown';
import '@brightspace-ui/core/components/dropdown/dropdown-context-menu';
import '@brightspace-ui/core/components/dropdown/dropdown-menu';
import '@brightspace-ui/core/components/icons/icon';
import '@brightspace-ui/core/components/menu/menu';
import '@brightspace-ui/core/components/menu/menu-item';
import './nothing-here-illustration';
import { bodyStandardStyles, heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { frequencies, statuses, types } from '../constants';
import { classMap } from 'lit-html/directives/class-map.js';
import { d2lTableStyles } from '../styles/d2lTableStyles';
import { formatDateTime } from '@brightspace-ui/intl/lib/dateTime';
import { getLocalDateTimeFromUTCDateTimeString } from '../dateTime';
import { getLocalizeResources } from '../localization.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { ManageSchedulesServiceFactory } from '../services/manageSchedulesServiceFactory';

class ManagerSchedules extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			dataHubAccess: {
				type: Boolean,
				attribute: 'data-hub-access'
			},
			schedules: {
				type: Array
			},
			manageSchedulesService: {
				type: Object
			}
		};
	}

	static get styles() {
		const manageSchedulesStyles = css`
			:host {
				display: inline-block;
				width: 100%;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-add-new-button {
				padding: 6px 0;
			}

			.d2l-spinner {
				display: flex;
				margin: 48px;
			}

			.d2l-description-text {
				margin-bottom: 0;
			}

			.d2l-no-data-hub-access {
				margin-bottom: 18px;
			}

			.d2l-message--empty-table {
				text-align: center;
			}

			.d2l-heading-2.d2l-nothing-title {
				margin-bottom: 18px;
				margin-top: 0;
			}

			.d2l-empty-table-wrapper {
				display: flex;
				flex-direction: column;
			}

			.d2l-get-started-button {
				align-self: center;
				margin: 12px;
			}
		`;
		return [
			d2lTableStyles,
			manageSchedulesStyles,
			bodyStandardStyles,
			heading2Styles
		];
	}

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs);
	}

	constructor() {
		super();
		this.manageSchedulesService = ManageSchedulesServiceFactory.getManageSchedulesService();

		this.schedules = Array();
		this.dataHubAccess = false;
	}

	async connectedCallback() {
		super.connectedCallback();

		// UTC -> Local DateTime conversion
		this.schedules.forEach(schedule => {
			if (schedule.lastRunTime)
				schedule.lastRunTime = getLocalDateTimeFromUTCDateTimeString(schedule.lastRunTime);

			if (schedule.nextRunTime)
				schedule.nextRunTime = getLocalDateTimeFromUTCDateTimeString(schedule.nextRunTime);
		});
	}

	render() {
		return html`
			${ this._renderResults() }
		`;
	}

	_formatDateTime(dateTime) {
		return dateTime === null || dateTime === undefined
			? this.localize('unavailableDate')
			: formatDateTime(dateTime, { format: 'short' });
	}

	_getScheduleById(scheduleId) {
		return this.schedules.find(schedule => schedule.scheduleId === scheduleId);
	}

	_handleEdit(event) {
		const schedule = this._getScheduleById(event.target.getAttribute('schedule-id'));
		window.location.href = `/d2l/custom/ads/scheduler/schedule/edit/${schedule.scheduleId}`;
	}

	async _handleEnableDisable(event) {
		const schedule = this._getScheduleById(event.target.getAttribute('schedule-id'));

		const response = await this.manageSchedulesService.setEnable(schedule.scheduleId, !schedule.isEnabled);
		if (response.status === 200) {
			schedule.isEnabled = !schedule.isEnabled;
			this.requestUpdate();
		} else {
			this.shadowRoot.getElementById('errorStatusToggleFailed').setAttribute('open', '');
		}
	}

	_handleNew() {
		window.location.href = '/d2l/custom/ads/scheduler/schedule/add';
	}

	async _handleRunNow(event) {

		const schedule = this._getScheduleById(event.target.getAttribute('schedule-id'));

		const response = await this.manageSchedulesService.runNow(schedule.scheduleId);
		if (response.status === 200) {
			const updatedSchedule = await this.manageSchedulesService.getSchedule(schedule.scheduleId);
			schedule.statusId = updatedSchedule.statusId;
			schedule.nextRunTime = getLocalDateTimeFromUTCDateTimeString(updatedSchedule.nextRunTime);
			this.requestUpdate();
		} else {
			this.shadowRoot.getElementById('errorRunNowFailed').setAttribute('open', '');
		}
	}

	_handleViewLog(event) {
		const schedule = this._getScheduleById(event.target.getAttribute('schedule-id'));
		window.location.href = `/d2l/custom/ads/scheduler/logs/view/${schedule.scheduleId}`;
	}

	_renderActionChevron(schedule) {
		return html`
			<d2l-dropdown>
				<d2l-button-icon
					id="dropdown-${schedule.scheduleId}"
					icon="tier2:chevron-down"
					class="d2l-dropdown-opener"
					aria-label="Open dropdown for ${schedule.name}">
				</d2l-button-icon>
				<d2l-dropdown-menu>
					<d2l-menu label="${ this.localize('menuLabel', 'scheduleName', schedule.name) }">
						${ this._renderEditDropdownOption(schedule.scheduleId) }
						<d2l-menu-item
							id="dropdown-log-${schedule.scheduleId}"
							schedule-id="${ schedule.scheduleId }"
							text="${  this.localize('actionViewLog')}"
							@d2l-menu-item-select="${ this._handleViewLog }">
						</d2l-menu-item>
						<d2l-menu-item
							id="dropdown-run-now-${schedule.scheduleId}"
							schedule-id="${ schedule.scheduleId }"
							text="${  this.localize('actionRunNow')}"
							@d2l-menu-item-select="${ this._handleRunNow }">
						</d2l-menu-item>
						<d2l-menu-item
							id="dropdown-enable-${schedule.scheduleId}"
							schedule-id="${ schedule.scheduleId }"
							text="${ schedule.isEnabled ? this.localize('actionDisable') : this.localize('actionEnable') }"
							@d2l-menu-item-select="${ this._handleEnableDisable }">
						</d2l-menu-item>
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown>
		`;
	}

	_renderAddNewButton() {
		if (this.dataHubAccess) {
			return html`
				<d2l-button-subtle
					id="add-new"
					class="d2l-add-new-button"
					icon="tier1:plus-large-thick"
					text="${ this.localize('actionNew') }"
					@click=${ this._handleNew }>
				</d2l-button-subtle>
			`;
		}
	}

	_renderEditDropdownOption(scheduleId) {
		if (this.dataHubAccess) {
			return html`
				<d2l-menu-item
					id="dropdown-edit-${scheduleId}"
					schedule-id="${ scheduleId }"
					text="${  this.localize('actionEdit') }"
					@d2l-menu-item-select="${ this._handleEdit }">
				</d2l-menu-item>
			`;
		}
	}

	_renderEmptyIllustration() {
		return html`
			<div class="d2l-message--empty-table">
				<nothing-here-illustration>
				</nothing-here-illustration>
				<h1 class="d2l-heading-2 d2l-nothing-title">
					${ this.localize('schedulerNothingTitle') }
				</h1>
				<div class="d2l-body-standard">
					${ this.localize('schedulerNothingMessage') }
				</div>
			</div>
		`;
	}

	_renderResults() {
		const isEmpty = this.schedules.length === 0;

		const baseTemplate = html`
			<div class="d2l-description-text d2l-body-standard ${classMap({ 'd2l-no-data-hub-access': !this.dataHubAccess })}">
				${ this.localize('schedulerDesc') }
			</div>
			<d2l-alert-toast id="errorStatusToggleFailed" type="critical">
				${ this.localize('statusToggleFailed') }
			</d2l-alert-toast>
			<d2l-alert-toast id="errorRunNowFailed" type="critical">
				${ this.localize('runNowFailed') }
			</d2l-alert-toast>
		`;

		if (isEmpty) {
			return html`
				<div class='d2l-empty-table-wrapper'>
					${ baseTemplate }
					${ this._renderEmptyIllustration() }
					<d2l-button
						id="get-started"
						primary
						?disabled="${!this.dataHubAccess}"
						class="d2l-get-started-button"
						@click=${ this._handleNew }>
							${ this.localize('actionStart') }
					</d2l-button>
				</div>
			`;
		} else {
			return html`
				${ baseTemplate }
				${ this._renderAddNewButton() }
				${ this._renderTable() }
			`;
		}
	}

	_renderScheduleRow(schedule) {
		return html`
			<tr>
				<td>
					${ schedule.name }
					${ this._renderActionChevron(schedule) }
				</td>
				<td>${ this.localize(`schedule.type.${types[schedule.typeId]}`) }</td>
				<td>${ this.localize(`schedule.frequency.${frequencies[schedule.frequencyId]}`) }</td>
				<td>${ this._formatDateTime(schedule.lastRunTime) }</td>
				<td>${ this._formatDateTime(schedule.nextRunTime) }</td>
				<td>${ schedule.isEnabled ? this.localize(`schedule.status.${statuses[schedule.statusId]}`) : this.localize('disabled') }</td>
			</tr>
		`;
	}

	_renderTable() {
		return html`
			<table>
				<thead>
					<th>${ this.localize('scheduleName') }</th>
					<th>${ this.localize('type') }</th>
					<th>${ this.localize('frequency') }</th>
					<th>${ this.localize('lastRunTime') }</th>
					<th>${ this.localize('nextRunTime') }</th>
					<th>${ this.localize('status') }</th>
				</thead>
				<tbody>
					${ this.schedules.map(schedule => this._renderScheduleRow(schedule)) }
				</tbody>
			</table>
		`;
	}

}
customElements.define('d2l-manage-schedules', ManagerSchedules);
