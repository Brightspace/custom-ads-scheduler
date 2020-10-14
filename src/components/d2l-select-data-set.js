import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui-labs/role-selector/role-item.js';
import '@brightspace-ui-labs/role-selector/role-selector.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { getLocalizeResources } from '../localization.js';
import { heading1Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles';

class SelectDataSet extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			scheduleName: {
				type: String,
				attribute: 'schedule-name'
			},
			dataSetOptions: {
				type: Array,
				attribute: 'data-set-options'
			},
			dataSet: {
				type: String,
				attribute: 'data-set'
			},
			orgUnitId: {
				type: String,
				attribute: 'org-unit-id'
			},
			roleItems: {
				type: Array,
				attribute: 'role-items'
			},
			rolesSelected: {
				type: Array,
				attribute: 'roles-selected'
			}
		};
	}

	static get styles() {
		const selectDataSetStyles = css`
			.sds-input-wrapper {
				width: 500px;
				margin-bottom: 20px;
			}

			#advanced-data-set {
				width: 100%;
			}
		`;
		return [
			heading1Styles,
			inputStyles,
			selectStyles,
			inputLabelStyles,
			selectDataSetStyles
		];
	}

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs);
	}

	constructor() {
		super();

		this.scheduleName = null;
		this.dataSetOptions = [];
		this.dataSet = null;
		this.orgUnitId = null;
		this.roleItems = [];
		this.rolesSelected = [];
	}

	render() {
		return html`
			<h1 class="d2l-heading-2">Select Your Advanced Data Set</h1>
			${ this._renderStep() }
		`;
	}

	_commitChanges() {
		const event = new CustomEvent('commit-changes', {
			detail: {
				scheduleName: this.scheduleName,
				dataSet: this.dataSet,
				orgUnitId: this.orgUnitId,
				rolesSelected: this.rolesSelected
			}
		});
		this.dispatchEvent(event);
	}

	_renderAdvancedDataSet() {
		return html`
			<div class="sds-input-wrapper">
				<label for="advanced-data-set" class="d2l-input-label">${ this.localize('step1.ads.label') }</label>
				<select id="advanced-data-set" class="d2l-input-select" @change="${ this._selectedDataSetChanged }">
					<option disabled selected value="">${ this.localize('step1.ads.placeholder') }</option>
					${ this.dataSetOptions.map(option => this._renderAdvancedDataSetOption(option)) }
				</select>
			</div>
		`;
	}

	_renderAdvancedDataSetOption(option) {
		return html`
			<option value=${ option.DataSetId } .selected="${ option.DataSetId === this.dataSet }">${ option.Name }</option>
		`;
	}

	_renderOrgUnitId() {
		return html`
			<div class="sds-input-wrapper">
				<d2l-input-text
					label="${ this.localize('step1.OrgUnitId.label')}"
					placeholder="${ this.localize('step1.OrgUnitId.placeholder')}"
					.value="${ this.orgUnitId}"
					@change="${ this._scheduleOrgUnitIdChanged}">
				</d2l-input-text>
			</div>
		`;
	}

	_renderRoleItems(role) {
		return html`
			<d2l-labs-role-item item-id="${role.Identifier}" display-name="${role.DisplayName}"></d2l-labs-role-item>
		`;
	}

	_renderScheduleName() {
		return html`
			<div class="sds-input-wrapper">
				<d2l-input-text
					label="${ this.localize('step1.scheduleName.label') }"
					placeholder="${ this.localize('step1.scheduleName.placeholder') }"
					.value="${ this.scheduleName }"
					@change="${ this._scheduleNameChanged }">
				</d2l-input-text>
			</div>
		`;
	}

	_renderSelectRoles() {
		return html`
			<d2l-labs-role-selector @d2l-labs-role-selected="${this._scheduleRolesChanged}">
				${ this.roleItems.map(role => this._renderRoleItems(role)) }
			</d2l-labs-role-selector>
		`;
	}

	_renderStep() {
		return html`
			<div class="step">
				${ this._renderScheduleName() }
				${ this._renderAdvancedDataSet() }
				${ this._renderOrgUnitId() }
				${ this._renderSelectRoles() }
				<!-- TODO: Filters? -->
			</div>
		`;
	}

	_scheduleNameChanged(event) {
		this.scheduleName = event.target.value;
		this._commitChanges();
	}

	_scheduleOrgUnitIdChanged(event) {
		this.orgUnitId = event.target.value;
		this._commitChanges();
	}

	_scheduleRolesChanged(event) {
		this.rolesSelected = event.detail.rolesSelected;
		this._commitChanges();
	}

	_selectedDataSetChanged(event) {
		this.dataSet = event.target.value;
		this._commitChanges();
	}
}

customElements.define('d2l-select-data-set', SelectDataSet);
