import '@brightspace-ui-labs/wizard/d2l-wizard.js';
import '@brightspace-ui-labs/wizard/d2l-step.js';
import './d2l-select-data-set';
import './d2l-configure-schedule';
import './d2l-delivery-method';
import { css, html, LitElement } from 'lit-element/lit-element';
import { frequenciesEnum, statusesEnum, typesEnum } from '../constants';
import { AddEditScheduleServiceFactory } from '../services/addEditScheduleServiceFactory';
import { formatDate } from '@brightspace-ui/intl/lib/dateTime';
import { getLocalizeResources } from '../localization.js';
import { ifDefined } from 'lit-html/directives/if-defined';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { ManageSchedulesServiceFactory } from '../services/manageSchedulesServiceFactory';

class WizardManager extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			scheduleId: {
				type: String
			},
			schedule: {
				type: Object
			},
			isLoading: {
				type: Boolean
			},
			selectedSchedule: {
				type: String
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
		const nowDate = formatDate(new Date(Date.now()), { format: 'yyyy-MM-dd' });
		this.cachedSchedule = {
			name: '',
			typeId: typesEnum.full,
			frequencyId: frequenciesEnum.daily,
			startDate: nowDate,
			endDate: nowDate,
			isEnabled: false,
			dataSetId: 'a0e3aca7-3bf2-4400-b831-9fdce98469b1',
			orgId: 1,
			createdBy: 1,
			createdDate: nowDate,
			statusId: statusesEnum.queued,
			preferredDay: 1,
			preferredTime: '00:00:00',
			deliveryTypeId: 1,
			filePath: ''
		};

		this.selectedSchedule = '';

		this.isLoading = true;
	}

	async connectedCallback() {
		super.connectedCallback();

		this.dataSetOptions = await this.addEditScheduleService.getAdvancedDataSets();
		this.roleItems = await this.addEditScheduleService.getRoles();

		await this._getSchedule();
	}

	render() {
		return html`
			${ this.isLoading ? this._renderSpinner() : this._renderPage() }
		`;
	}

	// TODO: Think about this some more... It would be nice to only have to cache these once
	// BUT can this result in our pointers being null?
	updated() {
		this.wizard = this.shadowRoot.getElementById('wizard');
		this.selectDataSet = this.shadowRoot.getElementById('select-data-set');
		this.configureSchedule = this.shadowRoot.getElementById('configure-schedule');
		this.deliveryMethod = this.shadowRoot.getElementById('delivery-method');
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

	get _deliveryTypeId() {
		return this.schedule ? this.schedule.deliveryTypeId : undefined;
	}

	get _editing() {
		return this.scheduleId !== undefined;
	}

	get _filePath() {
		return this.schedule ? this.schedule.filePath : undefined;
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

	_handleDeliveryMethodCommitChanges(event) {
		const commit = event.detail;
		window.console.log('Step Three Commit', commit);
		this._cacheCommit(commit);
	}

	_handleRestart() {
		const wizard = this.shadowRoot.getElementById('wizard');
		wizard.restart();
	}

	_handleSelectDataSetCommitChanges(event) {
		const commit = event.detail;
		window.console.log('Step One Commit', commit);
		this._cacheCommit(commit);
	}

	_handleStepOneNext() {
		if (this.selectDataSet.validate()) {
			this.wizard.next();
		}
	}

	async _handleStepThreeDone() {
		if (this.deliveryMethod.validate()) {
			try {
				await this._saveSchedule();
			} catch (e) {
				this.shadowRoot.getElementById('failed-to-save').setAttribute('open', '');
				return;
			}
			window.location.href = '/d2l/custom/ads/scheduler/manage';
		}
	}

	_handleStepTwoNext() {
		if (this.configureSchedule.validate()) {
			this.wizard.next();
		}
	}

	get _orgUnitId() {
		return this.schedule ? this.schedule.orgUnitId : undefined;
	}

	_renderPage() {
		return html`
			<d2l-labs-wizard id="wizard" class="wizard" @stepper-restart="${ this._handleRestart }">
				<d2l-labs-step title="${ this.localize('add.SelectDataSet')}" hide-restart-button="true" @stepper-next="${ this._handleStepOneNext }">
					<d2l-select-data-set
						id="select-data-set"
						@commit-changes="${ this._handleSelectDataSetCommitChanges }"
						schedule-name="${ ifDefined(this._scheduleName) }"
						data-set-options="${ this._dataSetOptions }"
						data-set="${ ifDefined(this._dataSetId) }"
						org-unit-id="${ ifDefined(this._orgUnitId) }"
						user-id="${ ifDefined(this._userId) }"
						role-items="${ this._roleItems }"
						roles-selected="${ ifDefined(this._roleIds) }">
					</d2l-select-data-set>
				</d2l-labs-step>

				<d2l-labs-step title="${ this.localize('add.ConfigureSchedule') }" @stepper-next="${ this._handleStepTwoNext }">
					<d2l-configure-schedule
						id="configure-schedule"
						@commit-changes="${ this._handleConfigureScheduleCommitChanges }"
						start-date=${ ifDefined(this.schedule?.startDate) }
						end-date=${ ifDefined(this.schedule?.endDate) }
						type=${ ifDefined(this.schedule?.typeId) }
						frequency=${ ifDefined(this.schedule?.frequencyId) }
						time=${ ifDefined(this.schedule?.preferredTime) }
						day=${ ifDefined(this.schedule?.preferredDay) }
						data-set-id="${ this.selectedSchedule }">
					</d2l-configure-schedule>
				</d2l-labs-step>

				<d2l-labs-step title="${ this.localize('add.DeliveryMethod') }" next-button-title="${ this.localize('add.Done') }" @stepper-next="${ this._handleStepThreeDone }">
					<d2l-delivery-method
						id="delivery-method"
						@commit-changes="${ this._handleDeliveryMethodCommitChanges }"
						delivery-method="${ ifDefined(this._deliveryTypeId) }"
						folder="${ ifDefined(this._filePath) }">
					</d2l-delivery-method>
				</d2l-labs-step>
			</d2l-labs-wizard>
			<d2l-alert-toast id="failed-to-save" type="critical">
				${ this.localize('add.FailedToSave') }
			</d2l-alert-toast>
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
			if (commit[p] === null) {
				delete this.cachedSchedule[p];
			} else {
				this.cachedSchedule[p] = commit[p];
			}
		});
		this.selectedSchedule = this.cachedSchedule.dataSetId
	}

	get _userId() {
		return this.schedule ? this.schedule.userId : undefined;
	}
}
customElements.define('d2l-wizard-manager', WizardManager);
