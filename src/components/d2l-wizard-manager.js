import '@brightspace-ui-labs/wizard/d2l-wizard.js';
import '@brightspace-ui-labs/wizard/d2l-step.js';
import './d2l-select-data-set';
import './d2l-configure-schedule';
import './d2l-delivery-method';
import { css, html, LitElement } from 'lit-element/lit-element';
import { getLocalizeResources } from '../localization.js';
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
			}
		};
	}

	static get styles() {
		const wizardManageStyles = css`
			.wizard {
				font-size: 16px;
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

		this.schedule = {};

		this.isLoading = true;
	}

	async connectedCallback() {
		super.connectedCallback();

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
	_renderPage() {
		return html`
			<d2l-labs-wizard id="wizard" class="wizard" @stepper-restart="${ this._handleRestart }">
				<d2l-labs-step title="${ this.localize('add.SelectDataSet')}" hide-restart-button="true" @stepper-next="${this._handleNext}">
					<d2l-select-data-set></d2l-select-data-set>
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

}
customElements.define('d2l-wizard-manager', WizardManager);
