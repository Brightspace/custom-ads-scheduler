import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/button/button-subtle';
import '@brightspace-ui/core/components/dropdown/dropdown';
import '@brightspace-ui/core/components/dropdown/dropdown-context-menu';
import '@brightspace-ui/core/components/dropdown/dropdown-menu';
import '@brightspace-ui/core/components/icons/icon';
import '@brightspace-ui/core/components/menu/menu';
import '@brightspace-ui/core/components/menu/menu-item';
import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
import './nothing-here-illustration';
import { bodyStandardStyles, heading2Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { d2lTableStyles } from '../styles/d2lTableStyles';
import { getLocalizeResources } from '../localization.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { ManageSchedulesServiceFactory } from '../services/manageSchedulesServiceFactory';

class ManageSchedules extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			schedules: {
				type: Array
			},
			manageSchedulesService: {
				type: Object
			},
			isLoading: {
				type: Boolean
			},
			tempShouldHaveSchedules: {
				type: Boolean
			}
		};
	}

	static get styles() {
		const manageSchedulesStyles = css`
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
				margin-bottom: 0px;
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

		this.isLoading = true;
	}

	async connectedCallback() {
		super.connectedCallback();

		this.isLoading = true;

		const schedules = await this.manageSchedulesService.getSchedules(this.tempShouldHaveSchedules);
		this._mapSchedulesArray(schedules);

		this.isLoading = false;
	}

	_mapSchedulesArray(schedulesArray) {
		if (schedulesArray) {
			this.schedules = schedulesArray;
		}
	}

	_renderEmptyIllustration() {
		return html`
			<div class="message--empty-table">
				<nothing-here-illustration>
				</nothing-here-illustration>
				<h1 class="d2l-heading-2 nothing-title">
					${ this.localize('schedulerNothingTitle') }
				</h1>
				<div class="d2l-body-standard">
					${ this.localize('schedulerNothingMessage') }
				</div>
			</div>
		`;
	}

	_renderTable() {
		return html`
			<table>
				<thead>
					<th>${ this.localize('scheduleName') }</th>
					<th>${ this.localize('type') }</th>
					<th>${ this.localize('frequency') }</th>
					<th>${ this.localize('scheduleDates') }</th>
					<th>${ this.localize('status') }</th>
				</thead>
				<tbody>
					${ this.schedules.map(schedule => this._renderScheduleRow(schedule)) }
				</tbody>
			</table>
		`;
	}

	_renderScheduleRow(schedule) {
		return html`
			<tr>
				<td>
					${ schedule.name }
					${ this._renderActionChevron(schedule) }
				</td>
				<td>${ schedule.type }</td>
				<td>${ schedule.frequency }</td>
				<td>${ schedule.startDate } - ${ schedule.endDate }</td>
				<td>${ schedule.enabled ? this.localize('enabled') : this.localize('disabled') }</td>
			</tr>
		`;
	}

	_renderActionChevron(schedule) {
		return html`
			<d2l-dropdown>
				<d2l-button-icon icon="tier2:chevron-down" class="d2l-dropdown-opener" aria-label="Open dropdown for ${schedule.name}"></d2l-button-icon>
				<d2l-dropdown-menu>
					<d2l-menu>
						<d2l-menu-item
							schedule-id="${ schedule.scheduleId }"
							text="${  this.localize('actionEdit') }"
							@click="${ this._handleEdit }">
						</d2l-menu-item>
						<d2l-menu-item
							schedule-id="${ schedule.scheduleId }"
							text="${  this.localize('actionViewLog')}"
							@click="${ this._handleViewLog }">
						</d2l-menu-item>
						<d2l-menu-item
							schedule-id="${ schedule.scheduleId }"
							text="${ schedule.enabled ? this.localize('actionDisable') : this.localize('actionEnable') }"
							@click="${ this._handleEnableDisable }">
						</d2l-menu-item>
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown>
		`;
	}

	_handleEdit(event) {
		const schedule = this._getScheduleById(parseInt(event.target.getAttribute('schedule-id')));
		console.log('Edit: ', schedule);
		window.location.href = `/d2l/custom/ads/scheduler/schedule/edit/${schedule.scheduleId}`;
		// Edit schedule
	}

	_handleNew(event) {
		const schedule = this._getScheduleById(parseInt(event.target.getAttribute('schedule-id')));
		console.log('New: ', schedule);
		window.location.href = '/d2l/custom/ads/scheduler/schedule/add';
		// New schedule
	}

	_handleViewLog(event) {
		const schedule = this._getScheduleById(parseInt(event.target.getAttribute('schedule-id')));
		console.log('Log: ', schedule);
		window.location.href = `/d2l/custom/ads/scheduler/logs/view/${schedule.scheduleId}`;
		// Go to log page
	}

	_handleEnableDisable(event) {
		const schedule = this._getScheduleById(parseInt(event.target.getAttribute('schedule-id')));
		schedule.enabled = !schedule.enabled;
		this.requestUpdate();
		console.log('Enalbe/disable: ', schedule);
		// Enable or disable as necessary
	}

	_getScheduleById(scheduleId) {
		return this.schedules.find(schedule => schedule.scheduleId === scheduleId);
	}

	_renderResults() {
		const isEmpty = this.schedules.length === 0;

		const baseTemplate = html`
			<div class="description-text d2l-body-standard">
				${ this.localize('schedulerDesc') }
			</div>
		`;

		if (isEmpty) {
			return html`
				<div class='empty-table-wrapper'>
					${ baseTemplate }
					${ this._renderEmptyIllustration() }
					<d2l-button
						primary
						class="get-started-button"
						@click=${ this._handleNew }>
							${ this.localize('actionStart') }
					</d2l-button>
				</div>
			`;
		} else {
			return html`
				${ baseTemplate }
				<d2l-button-subtle
					class="add-new-button"
					icon="tier1:plus-large-thick"
					text="${ this.localize('actionNew') }"
					@click=${ this._handleNew }>
				</d2l-button-subtle>
				${ this._renderTable() }
			`;
		}
	}

	_renderSpinner() {
		return html`
			<d2l-loading-spinner
				class="spinner"
				size=100>
			</d2l-loading-spinner>
		`;
	}

	render() {
		return html`
			${ this.isLoading ? this._renderSpinner() : this._renderResults() }
		`;
	}
}
customElements.define('d2l-manage-schedules', ManageSchedules);
