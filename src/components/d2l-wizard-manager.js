import '@brightspace-ui-labs/wizard/d2l-wizard.js';
import '@brightspace-ui-labs/wizard/d2l-step.js';
import './d2l-select-data-set';
import './d2l-configure-schedule';
import './d2l-delivery-method';
import { css, html, LitElement } from 'lit-element/lit-element';
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

		this.isLoading = true;
	}

	async connectedCallback() {
		super.connectedCallback();

		this.dataSetOptions = await this.addEditScheduleService.getAdvancedDataSets();
		this.roleItems = await this.addEditScheduleService.getRoles();

		if (this.scheduleId) {
			this.isLoading = true;

			this.schedule = await this.manageSchedulesService.getSchedule(this.scheduleId);
		}

		this.isLoading = false;
	}

	render() {
		return html`
			${ this.isLoading ? this._renderSpinner() : this._renderPage() }
		`;
	}

	get _dataSetId() {
		return this.schedule ? this.schedule.dataSetId : undefined;
	}

	get _dataSetOptions() {
		return JSON.stringify(this.dataSetOptions);
	}

	_handleDone() {
		// save data then redirect to manage
		window.location.href = '/d2l/custom/ads/scheduler/manage';
	}

	_handleNext() {
		const wizard = this.shadowRoot.getElementById('wizard');
		wizard.next();
	}

	_handleRestart() {
		const wizard = this.shadowRoot.getElementById('wizard');
		wizard.restart();
	}

	_handleSelectDataSetCommitChanges(event) {
		const commit = event.detail;
		window.console.log('Step One Commit', commit);
	}

	get _orgUnitId() {
		return this.schedule ? this.schedule.orgUnitId : undefined;
	}

	_renderPage() {
		return html`
			<d2l-labs-wizard id="wizard" class="wizard" @stepper-restart="${ this._handleRestart }">
				<d2l-labs-step title="${ this.localize('add.SelectDataSet')}" hide-restart-button="true" @stepper-next="${ this._handleNext }">
					<d2l-select-data-set 
						@commit-changes="${ this._handleSelectDataSetCommitChanges }"
						schedule-name="${ ifDefined(this._scheduleName) }"
						data-set-options="${ this._dataSetOptions }"
						data-set="${ ifDefined(this._dataSetId) }"
						org-unit-id="${ ifDefined(this._orgUnitId) }"
						role-items="${ this._roleItems }"
						roles-selected="${ ifDefined(this._roleIds) }">
					</d2l-select-data-set>
				</d2l-labs-step>

				<d2l-labs-step title="${ this.localize('add.ConfigureSchedule') }" @stepper-next="${ this._handleNext }">
					<d2l-configure-schedule></d2l-configure-schedule>
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

	get _roleIds() {
		return this.schedule ? JSON.stringify(this.schedule.roleIds) : undefined;
	}

	get _roleItems() {
		return JSON.stringify(this.roleItems);
	}

	get _scheduleName() {
		return this.schedule?.name || undefined;
	}

}
customElements.define('d2l-wizard-manager', WizardManager);
