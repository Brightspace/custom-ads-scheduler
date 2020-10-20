import '@brightspace-ui-labs/wizard/d2l-wizard.js';
import '@brightspace-ui-labs/wizard/d2l-step.js';
import './d2l-select-data-set';
import './d2l-configure-schedule';
import './d2l-delivery-method';
import { css, html, LitElement } from 'lit-element/lit-element';
import { frequenciesEnum, statusesEnum, typesEnum } from '../constants';
import { AddEditScheduleServiceFactory } from '../services/addEditScheduleServiceFactory';
import { getLocalizeResources } from '../localization.js';
import { ifDefined } from 'lit-html/directives/if-defined';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { ManageSchedulesServiceFactory } from '../services/manageSchedulesServiceFactory';

class WizardManager extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			scheduleId: {
				type: Number
			},
			schedule: {
				type: Object
			},
			isLoading: {
				type: Boolean
			}
		};
	}

	static get styles() {
		const wizardManageStyles = css`
			.wizard {
				font-size: 16px;
			}
			.spinner {
				width: 100%;
			}
		`;
		return [wizardManageStyles];
	}

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs);
	}

	constructor() {
		super();

		this.manageSchedulesService = ManageSchedulesServiceFactory.getManageSchedulesService();
		this.addEditScheduleService = AddEditScheduleServiceFactory.getAddEditScheduleService();

		// TODO: Remove these default values when the wizard is complete - we need these for now, in order to pass validation
		const nowDateTime = new Date(Date.now()).toISOString();
		this.cachedSchedule = {
			name: '',
			typeId: typesEnum.full,
			frequencyId: frequenciesEnum.daily,
			startDate: nowDateTime,
			endDate: nowDateTime,
			isEnabled: false,
			dataSetId: 'a0e3aca7-3bf2-4400-b831-9fdce98469b1',
			orgId: 1,
			createdBy: 1,
			createdDate: nowDateTime,
			statusId: statusesEnum.queued,
			preferredDay: 1,
			preferredTime: nowDateTime,
			deliveryTypeId: 1,
			filePath: '',
			filters: []
		};

		this.isLoading = true;
	}

	async connectedCallback() {
		super.connectedCallback();

		this.dataSetOptions = await this.addEditScheduleService.getAdvancedDataSets();
		this._getSchedule();
	}

	render() {
		return html`
			${ this.isLoading ? this._renderSpinner() : this._renderPage() }
		`;
	}
	async _cacheCommit(commit) {
		this._updateScheduleCache(commit);
	}

	get _dataSetId() {
		return this.schedule ? this.schedule.dataSetId : undefined;
	}

	get _dataSetOptions() {
		return JSON.stringify(this.dataSetOptions);
	}

	get _editing() {
		return this.scheduleId !== undefined;
	}

	async _getSchedule() {
		if (this._editing) {
			this.isLoading = true;
			this.schedule = await this.manageSchedulesService.getSchedule(this.scheduleId);
			this._updateScheduleCache(this.schedule);
		}
		this.isLoading = false;
	}

	_handleConfigureScheduleCommitChanges(event) {
		const commit = event.detail;
		window.console.log('Step Two Commit', commit);
		this._cacheCommit(commit);
	}

	async _handleDone() {
		await this._saveSchedule();
		window.location.href = '/d2l/custom/ads/scheduler/manage';
	}

	async _handleNext() {

		// TODO: This is for demo/testing purposes. In practice, we will only save at the end of step 3 (in _handleDone)
		await this._saveSchedule();

		const wizard = this.shadowRoot.getElementById('wizard');
		wizard.next();
	}

	async _handleRestart() {
		const wizard = this.shadowRoot.getElementById('wizard');
		wizard.restart();
	}

	_handleSelectDataSetCommitChanges(event) {
		const commit = event.detail;
		window.console.log('Step One Commit', commit);
		this._cacheCommit(commit);
	}

	_renderPage() {
		return html`
			<d2l-labs-wizard id="wizard" class="wizard" @stepper-restart="${ this._handleRestart }">
				<d2l-labs-step title="${ this.localize('add.SelectDataSet')}" hide-restart-button="true" @stepper-next="${this._handleNext}">
					<d2l-select-data-set 
						@commit-changes="${ this._handleSelectDataSetCommitChanges }"
						schedule-name="${ ifDefined(this._scheduleName) }"
						data-set-options="${ this._dataSetOptions }"
						data-set="${ ifDefined(this._dataSetId) }">
					</d2l-select-data-set>
				</d2l-labs-step>

				<d2l-labs-step title="${ this.localize('add.ConfigureSchedule') }" @stepper-next="${ this._handleNext }">
					<d2l-configure-schedule
						@commit-changes="${ this._handleConfigureScheduleCommitChanges }"
						start-date=${ ifDefined(this.schedule?.startDate) }
						end-date=${ ifDefined(this.schedule?.endDate) }
						type=${ ifDefined(this.schedule?.type) }
						frequency=${ ifDefined(this.schedule?.frequencyId) }
						time=${ ifDefined(this.schedule?.preferredTime) }>
					</d2l-configure-schedule>
				</d2l-labs-step>

				<d2l-labs-step title="${ this.localize('add.DeliveryMethod') }" next-button-title="${ this.localize('add.Done') }" @stepper-next="${ this._handleDone }">
					<d2l-delivery-method></d2l-delivery-method>
				</d2l-labs-step>
			</d2l-labs-wizard>
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

	async _saveSchedule() {
		if (this._editing) {
			await this.manageSchedulesService.editSchedule(this.scheduleId, this.cachedSchedule);
		} else {
			await this.manageSchedulesService.addSchedule(this.cachedSchedule);
		}
	}

	get _scheduleName() {
		return this.schedule?.name || undefined;
	}

	_updateScheduleCache(commit) {
		const props = Object.keys(commit);
		props.forEach(p => {
			this.cachedSchedule[p] = commit[p];
		});
	}

}
customElements.define('d2l-wizard-manager', WizardManager);
