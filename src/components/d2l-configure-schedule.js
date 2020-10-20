import '@brightspace-ui/core/components/inputs/input-date-range.js';
import '@brightspace-ui/core/components/inputs/input-text.js';
import '@brightspace-ui/core/components/inputs/input-time.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { formatDate } from '@brightspace-ui/intl/lib/dateTime';
import { getLocalizeResources } from '../localization.js';
import { heading1Styles } from '@brightspace-ui/core/components/typography/styles.js';
import { inputLabelStyles } from '@brightspace-ui/core/components/inputs/input-label-styles';
import { inputStyles } from '@brightspace-ui/core/components/inputs/input-styles.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import { selectStyles } from '@brightspace-ui/core/components/inputs/input-select-styles';

class ConfigureSchedule extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			startDate: {
				type: String,
				attribute: 'start-date'
			},
			endDate: {
				type: String,
				attribute: 'end-date'
			},
			type: {
				type: Number,
				attribute: 'type'
			},
			frequency: {
				type: Number,
				attribute: 'frequency'
			},
			time: {
				type: String,
				attribute: 'time'
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

		this.startDate = '';
		this.endDate = '';
		this.type = 1;
		this.frequency = 1;
		this.time = '';
	}

	render() {
		return html`
			<h1 class="d2l-heading-2">Schedule Details</h1>
			${ this._renderStep() }
		`;
	}

	_commitChanges() {
		const event = new CustomEvent('commit-changes', {
			detail: {
				startDate: this.startDate,
				endDate: this.endDate,
				typeId: this.type,
				frequencyId: this.frequency,
				preferredTime: this.time
			}
		});
		this.dispatchEvent(event);
	}

	_formatDate(date) {
		return date || formatDate(new Date(Date.now()), { format: 'yyyy-MM-dd' });
	}

	get _isDifferential() {
		return this.type === 2;
	}

	_renderDates() {
		return html`
			<div class="dates-wrapper">
				<d2l-input-date
					label="${ this.localize('step2.dates.start') }"
					value="${ this._formatDate(this.startDate) }"
					min-value="${ this._formatDate() }"
					max-value="${ this._formatDate(this.endDate) }"
					@change="${ this._selectedStartDateChanged }">
				</d2l-input-date>

				<d2l-input-date
					label="${ this.localize('step2.dates.end') }"
					value="${ this._formatDate(this.endDate) }"
					min-value="${ this._formatDate(this.startDate) }"
					@change="${ this._selectedEndDateChanged }">
				</d2l-input-date>
			</div>
		`;
	}

	_renderFrequency() {
		return html`
			<div class="property-wrapper">
				<label for="frequency" class="d2l-input-label">${ this.localize('step2.frequency.label') }</label>
				<select id="frequency" class="d2l-input-select" @change="${ this._selectedFrequencyChanged }">
					<option disabled selected value="">${ this.localize('step2.frequency.placeholder') }</option>
					${ this._renderFrequencyOptions() }
				</select>
			</div>
		`;
	}

	_renderFrequencyOptions() {
		return html`
			${ this._showFifteenMinFrequency ? html`<option value="4" .selected="${ this.frequency === 4 }">${ this.localize('step2.frequency.15mins') }</option>` : ''}
			${ this._showHourlyFrequency ? html`<option value="3" .selected="${ this.frequency === 3 }">${ this.localize('step2.frequency.hourly') }</option>` : ''}
			<option value="2" .selected="${ this.frequency === 2 }">${ this.localize('step2.frequency.daily') }</option>
			<option value="1" .selected="${ this.frequency === 1 }">${ this.localize('step2.frequency.weekly') }</option>
		`;
	}

	_renderStep() {
		return html`
			<div class="step">
				${ this._renderDates() }
				${ this._renderType() }
				${ this._renderFrequency() }
				${ this._showTime ? this._renderTime() : '' }
			</div>
		`;
	}

	_renderTime() {
		return html`
			<div class="property-wrapper">
				<d2l-input-time
					label="${ this.localize('step2.time.label') }"
					value=${ this.time }
					@change="${ this._selectedTimeChanged }">
				</d2l-input-time>
			</div>
		`;
	}

	_renderType() {
		return html`
			<div class="property-wrapper">
				<label for="type" class="d2l-input-label">${ this.localize('step2.type.label') }</label>
				<select id="type" class="d2l-input-select" @change="${ this._selectedTypeChanged }">
					<option disabled selected value="">${ this.localize('step2.type.placeholder') }</option>
					<option value="1" .selected="${ this.type === 1 }">${ this.localize('step2.type.full') }</option>
					<option value="2" .selected="${ this.type === 2 }">${ this.localize('step2.type.differential') }</option>
				</select>
			</div>
		`;
	}

	_selectedEndDateChanged(event) {
		this.endDate = event.target.value;
		this._commitChanges();
		this.requestUpdate();
	}

	_selectedFrequencyChanged(event) {
		this.frequency = Number(event.target.value);
		this._commitChanges();
	}

	_selectedStartDateChanged(event) {
		this.startDate = event.target.value;
		this._commitChanges();
		this.requestUpdate();
	}

	_selectedTimeChanged(event) {
		this.time = event.target.value;
		this._commitChanges();
	}

	_selectedTypeChanged(event) {
		this.type = Number(event.target.value);
		this._commitChanges();
	}

	get _showFifteenMinFrequency() {
		return this._isDifferential || this.showFifteenMinFrequency;
	}

	get _showHourlyFrequency() {
		return this._isDifferential;
	}

	get _showTime() {
		return this.frequency === 2;
	}

}

customElements.define('d2l-configure-schedule', ConfigureSchedule);
