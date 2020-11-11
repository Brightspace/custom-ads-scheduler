import '@brightspace-ui/core/components/alert/alert-toast';
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
			filters: {
				type: Array
			},
			orgUnitId: {
				type: String,
				attribute: 'org-unit-id'
			},
			userId: {
				type: String,
				attribute: 'user-id'
			},
			roleItems: {
				type: Array,
				attribute: 'role-items'
			},
			rolesSelected: {
				type: Array,
				attribute: 'roles-selected'
			},
			invalidScheduleName: {
				type: Boolean
			},
			invalidDataSet: {
				type: Boolean
			},
			invalidOrgUnitId: {
				type: Boolean
			},
			invalidUserId: {
				type: Boolean
			},
			errorText: {
				type: String
			}
		};
	}

	static get styles() {
		const selectDataSetStyles = css`
			.step {
				margin: 20px 0px 60px 0;
			}

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
		this.userId = null;
		this.roleItems = [];
		this.rolesSelected = [];
		this.filters = [];

		this.invalidScheduleName = false;
		this.invalidDataSet = false;
		this.invalidOrgUnitId = false;
		this.invalidUserId = false;
		this.errorText = '';
	}

	async connectedCallback() {
		super.connectedCallback();

		// Sanitize any incoming filters that conflict with the selected data set
		this._updateFilters();
		this._commitChanges();
	}

	render() {
		return html`
			<h1 class='d2l-heading-2'>Select Your Advanced Data Set</h1>
			${ this._renderStep() }
			<d2l-alert-toast id='invalid-properties' type='critical'>
				${ this.errorText }
			</d2l-alert-toast>
		`;
	}

	validate() {
		this._validateScheduleName();
		this._validateDataSet();
		this._validateUserId();
		this._validateOrgUnitId();

		this.errorText = this.localize('step1.validation.prefix');

		if (this.invalidScheduleName) this.errorText += ` ${this.localize('step1.scheduleName.label')}`;
		if (this.invalidDataSet) this.errorText += `${this.invalidScheduleName ?  ', ' : ''} ${ this.localize('step1.ads.label') }`;

		if (this.invalidScheduleName || this.invalidDataSet) {
			this.shadowRoot.getElementById('invalid-properties').setAttribute('open', '');
		}

		const invalid = this.invalidScheduleName
			|| this.invalidDataSet
			|| (this._showUserId && this.invalidUserId)
			|| (this._showOrgUnit && this.invalidOrgUnitId);

		return !invalid;
	}

	_commitChanges() {
		const event = new CustomEvent('commit-changes', {
			detail: {
				name: this.scheduleName,
				dataSetId: this.dataSet,
				userId: this._showUserId ? this.userId : null,
				orgUnitId: this._showOrgUnit ? this.orgUnitId : null,
				roleIds: this._showRoles ? this.rolesSelected : null
			}
		});
		this.dispatchEvent(event);
	}

	_orgUnitIdChanged(event) {
		this.orgUnitId = event.target.value;
		this._validateOrgUnitId();
		this._commitChanges();
	}

	_renderAdvancedDataSet() {
		return html`
			<div class='sds-input-wrapper'>
				<label for='advanced-data-set' class='d2l-input-label'>${ this.localize('step1.ads.label') } *</label>
				<select
					id='advanced-data-set'
					class='d2l-input-select'
					@change='${ this._selectedDataSetChanged }'
					aria-invalid='${ this.invalidDataSet }'>
					<option disabled selected value=''>${ this.localize('step1.ads.placeholder') }</option>
					${ this.dataSetOptions.map(option => this._renderAdvancedDataSetOption(option)) }
				</select>
			</div>
		`;
	}
	_renderAdvancedDataSetOption(option) {
		return html`
			<option value=${ option.DataSetId } .selected='${ option.DataSetId === this.dataSet }'>${ option.Name }</option>
		`;
	}

	_renderFilters() {
		if (this._showUserId && this._showOrgUnit && this._showRoles) {
			return html`
				${ this._renderUserId() }
				${ this._renderOrgUnitId() }
				${ this._renderSelectRoles() }
			`;
		}

		if (this._showUserId && this._showOrgUnit) {
			return html`
				${ this._renderUserId() }
				${ this._renderOrgUnitId() }
			`;
		}

		if (this._showUserId && this._showRoles) {
			return html`
				${ this._renderUserId() }
				${ this._renderSelectRoles() }
			`;
		}

		if (this._showOrgUnit && this._showRoles) {
			return html`
				${ this._renderOrgUnitId() }
				${ this._renderSelectRoles() }
			`;
		}

		if (this._showUserId) {
			return this._renderUserId();
		}

		if (this._showOrgUnit) {
			return this._renderOrgUnitId();
		}

		if (this._showRoles) {
			return this._renderSelectRoles();
		}

		return;
	}

	_renderOrgUnitId() {
		return html`
			<div class='sds-input-wrapper'>
				<d2l-input-text
					aria-invalid='${ this.invalidOrgUnitId }'
					label='${ this.localize('step1.orgUnitId.label') } *'
					placeholder='${ this.localize('step1.orgUnitId.placeholder') }'
					.value='${ this.orgUnitId }'
					maxlength='10'
					@change='${ this._orgUnitIdChanged }'>
				</d2l-input-text>
				${ this.invalidOrgUnitId ? html`<d2l-tooltip state="error" align="start">${ this.localize('step1.orgUnitId.errorMessage') }</d2l-tooltip>` : null }
			</div>
		`;
	}

	_renderRoleItems(role, roleList) {
		if (roleList.includes(role.Identifier)) {
			return html`
				<d2l-labs-role-item item-id='${ role.Identifier }' display-name='${ role.DisplayName }' selected></d2l-labs-role-item>
			`;
		}

		return html`
			<d2l-labs-role-item item-id='${ role.Identifier }' display-name='${ role.DisplayName }'></d2l-labs-role-item>
		`;
	}

	_renderScheduleName() {
		return html`
			<div class='sds-input-wrapper'>
				<d2l-input-text
					aria-invalid='${ this.invalidScheduleName }'
					label='${ this.localize('step1.scheduleName.label') } *'
					placeholder='${ this.localize('step1.scheduleName.placeholder') }'
					.value='${ this.scheduleName }'
					maxlength='255'
					@change='${ this._scheduleNameChanged }'>
				</d2l-input-text>
			</div>
		`;
	}

	_renderSelectRoles() {
		const roleList = this.rolesSelected.toString().split(',');

		return html`
			<d2l-labs-role-selector
				@d2l-labs-role-selected='${ this._selectedRolesChanged }'>
				${ this.roleItems.map(role => this._renderRoleItems(role, roleList)) }
			</d2l-labs-role-selector>
		`;
	}

	_renderStep() {
		return html`
			<div class='step'>
				${ this._renderScheduleName()}
				${ this._renderAdvancedDataSet()}
				${ this._renderFilters()}
			</div>
		`;
	}

	_renderUserId() {
		return html`
			<div class='sds-input-wrapper'>
				<d2l-input-text
					aria-invalid='${ this.invalidUserId }'
					label='${ this.localize('step1.userId.label') } *'
					placeholder='${ this.localize('step1.userId.placeholder') }'
					.value='${ this.userId }'
					maxlength='10'
					@change='${ this._userIdChanged }'>
				</d2l-input-text>
				${ this.invalidUserId ? html`<d2l-tooltip state="error" align="start">${ this.localize('step1.userId.errorMessage') }</d2l-tooltip>` : null }
			</div>
		`;
	}

	_scheduleNameChanged(event) {
		this.scheduleName = event.target.value;
		this._validateScheduleName();
		this._commitChanges();
	}

	_selectedDataSetChanged(event) {
		this.dataSet = event.target.value;
		this._updateFilters();
		this._validateDataSet();
		this._commitChanges();
	}

	_selectedRolesChanged(event) {
		this.rolesSelected = event.detail.rolesSelected.join();
		this._commitChanges();
	}

	get _showOrgUnit() {
		return this.filters.includes('parentOrgUnitId');
	}

	get _showRoles() {
		return this.filters.includes('roles');
	}

	get _showUserId() {
		return this.filters.includes('userId');
	}

	_updateFilters() {
		const filtersArray = this.dataSetOptions
			.filter(option => option.DataSetId === this.dataSet)
			.map(data => { return data.Filters; })[0];

		this.filters = filtersArray ? filtersArray.map(f => { return f.Name; }) : [];
	}

	_userIdChanged(event) {
		this.userId = event.target.value;
		this._validateUserId();
		this._commitChanges();
	}

	_validateDataSet() {
		this.invalidDataSet = this.dataSet === null;
	}

	_validateNumberOnlyInput(input) {
		return input === null
			|| input === undefined
			|| input.trim() === ''
			|| input.length > 1024
			|| isNaN(Number(input))
			|| Number(input) < 0
			|| !Number.isInteger(Number(input));
	}

	_validateOrgUnitId() {
		if (this._showOrgUnit) {
			this.invalidOrgUnitId = this._validateNumberOnlyInput(this.orgUnitId);
		}
	}

	_validateScheduleName() {
		this.invalidScheduleName = this.scheduleName === ''
			|| this.scheduleName === null
			|| this.scheduleName === undefined;
	}

	_validateUserId() {
		if (this._showUserId) {
			this.invalidUserId = this._validateNumberOnlyInput(this.userId);
		}
	}
}

customElements.define('d2l-select-data-set', SelectDataSet);
