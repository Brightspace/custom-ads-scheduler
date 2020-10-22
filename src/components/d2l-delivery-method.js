import '@brightspace-ui/core/components/inputs/input-text.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { getLocalizeResources } from '../localization.js';
import { heading1Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles';

class DeliveryMethod extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			deliveryMethod: {
				type: String,
				attribute: 'delivery-method'
			},
			folder: {
				type: String,
				attribute: 'folder'
			}
		};
	}

	static get styles() {
		const selectDeliveryStyles = css`
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
			selectDeliveryStyles
		];
	}

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs);
	}

	constructor() {
		super();
		this.deliveryMethod = null;
		this.folder = null;
	}

	render() {
		return html`
			<h1 class="d2l-heading-2">Delivery Method</h1>
			${ this._renderStep() }
		`;
	}

	_commitChanges() {
		const event = new CustomEvent('commit-changes', {
			detail: {
				deliveryTypeId: this.deliveryMethod,
				filePath: this.folder
			}
		});
		this.dispatchEvent(event);
	}

	_renderDeliveryMethod() {
		return html`
			<div class="sds-input-wrapper">
				<label for="advanced-data-set" class="d2l-input-label">${ this.localize('step3.deliveryMethod.label') }</label>
				<select id="advanced-data-set" class="d2l-input-select" @change="${ this._scheduleDeliveryMethodChanged }">
					<option disabled selected value="">${ this.localize('step3.deliveryMethod.placeholder') }</option>			
					<option value='1' .selected="${ this.deliveryMethod === '1'}">${ this.localize('step3.deliveryType.BrightspaceFilePath') }</option>
		            <option value='2' .selected="${ this.deliveryMethod === '2'}">${ this.localize('step3.deliveryType.BrightspaceSFTP') }</option>
					<option value='3' .selected="${ this.deliveryMethod === '3'}">${ this.localize('step3.deliveryType.CustomSFTP') }</option>
				</select>
			</div>
		`;
	}

	_renderFolder() {
		return html`
			<div class="sds-input-wrapper">
				<d2l-input-text
					label="${ this.localize('step3.folder.label') }"
					.value="${ this.folder }"
					@change="${ this._scheduleFolderChanged }">
				</d2l-input-text>
			</div>
		`;
	}

	_renderStep() {
		return html`
			<div class="step">
				${ this._renderDeliveryMethod() }
				${ this._renderFolder() }
			</div>
		`;
	}

	_scheduleDeliveryMethodChanged(event) {
		this.deliveryMethod = event.target.value;
		this._commitChanges();
	}

	_scheduleFolderChanged(event) {
		this.folder = event.target.value;
		this._commitChanges();
	}
}

customElements.define('d2l-delivery-method', DeliveryMethod);
