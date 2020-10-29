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
			},
			day: {
				type: Number,
				attribute: 'day'
			},
			invalidStartDate: {
				type: Boolean
			},
			invalidEndDate: {
				type: Boolean
			},
			invalidType: {
				type: Boolean
			},
			invalidFrequency: {
				type: Boolean
			},
			invalidTime: {
				type: Boolean
			},
			invalidDay: {
				type: Boolean
			},
			startAfterEndDate: {
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

			.property-wrapper {
				width: 500px;
				margin-bottom: 20px;
			}

			.property-wrapper > .d2l-input-select {
				width: 100%;
			}

			.dates-wrapper {
				display: flex;
			}

			.date-wrapper {
				flex: 1;
			}

			.one-line-tooltip {
				white-space: nowrap;
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

		const nowDate = formatDate(new Date(Date.now()), { format: 'yyyy-MM-dd' });
		this.startDate = nowDate;
		this.endDate = nowDate;
		this.time = '00:00:00';
		this.preferredDay = 0;

		this.invalidStartDate = false;
		this.invalidEndDate = false;
		this.invalidType = false;
		this.invalidFrequency = false;
		this.invalidTime = false;
		this.invalidDay = false;

		this.startAfterEndDate = false;

		this.errorText = '';
	}

	render() {
		return html`
			<h1 class="d2l-heading-2">Schedule Details</h1>
			${ this._renderStep() }
			<d2l-alert-toast id="invalid-properties" type="critical">
				${ this.errorText }
			</d2l-alert-toast>
		`;
	}

	validate() {
		this._validateStartDate();
		this._validateEndDate();
		this._validateStartBeforeEndDate();
		this._validateType();
		this._validateFrequency();
		this._validateTime();
		this._validateDay();

		this.errorText = this.localize('step2.validation.prefix');

		const invalid = this.invalidStartDate
			|| this.invalidEndDate
			|| this.invalidType
			|| this.invalidFrequency
			|| this.invalidTime
			|| this.invalidDay
			|| this.startAfterEndDate;

		const invalidProperties = [];
		if (this.invalidStartDate) invalidProperties.push(this.localize('step2.dates.start'));
		if (this.invalidEndDate) invalidProperties.push(this.localize('step2.dates.end'));
		if (this.invalidType) invalidProperties.push(this.localize('step2.type.label'));
		if (this.invalidFrequency) invalidProperties.push(this.localize('step2.frequency.label'));
		if (this.invalidTime) invalidProperties.push(this.localize('step2.time.label'));
		if (this.invalidDay) invalidProperties.push(this.localize('step2.day.label'));

		for (let i = 0; i < invalidProperties.length; i++) {
			this.errorText += `${ i === 0 ? ' ' : ', ' }${ invalidProperties[i] }`;
		}

		if (invalid) {
			this.shadowRoot.getElementById('invalid-properties').setAttribute('open', '');
		}

		return !invalid;
	}

	_commitChanges() {
		const event = new CustomEvent('commit-changes', {
			detail: {
				startDate: this.startDate,
				endDate: this.endDate,
				typeId: this.type,
				frequencyId: this.frequency,
				preferredTime: this.time,
				preferredDay: this.day
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
			<div class="property-wrapper dates-wrapper">

				<div>
					<!-- This component does its own specialized tooltips -->
					<d2l-input-date-range
						id="dates"
						label="Schedule Start and End Dates"
						label-hidden
						inclusive-date-range
						start-label="${ this.localize('step2.dates.start') } *"
						end-label="${ this.localize('step2.dates.end') } *"
						start-value="${ this._formatDate(this.startDate) }"
						end-value="${ this._formatDate(this.endDate) }"
						@change="${ this._selectedStartEndDateChanged }">
					</d2l-input-date-range>
				</div>

			</div>
		`;
	}

	_renderDay() {
		return html`
			<div class="property-wrapper">
				<label for="day" class="d2l-input-label">${ this.localize('step2.day.label') } *</label>
				<select id="day" class="d2l-input-select"
				 	@change="${ this._selectedDayChanged }"
					aria-invalid="${ this.invalidDay }">
					<option value="0" .selected="${ this.day === 0 }">${ this.localize('step2.day.sunday') }</option>
					<option value="1" .selected="${ this.day === 1 }">${ this.localize('step2.day.monday') }</option>
					<option value="2" .selected="${ this.day === 2 }">${ this.localize('step2.day.tuesday') }</option>
					<option value="3" .selected="${ this.day === 3 }">${ this.localize('step2.day.wednesday') }</option>
					<option value="4" .selected="${ this.day === 4 }">${ this.localize('step2.day.thursday') }</option>
					<option value="5" .selected="${ this.day === 5 }">${ this.localize('step2.day.friday') }</option>
					<option value="6" .selected="${ this.day === 6 }">${ this.localize('step2.day.saturday') }</option>
				</select>
				${ this.invalidDay ? html`
				<d2l-tooltip for="day" state="error" align="start" offset="10" class="one-line-tooltip">
					Preferred Day must be selected
				</d2l-tooltip>
				` : ''}
			</div>
		`;
	}

	_renderFrequency() {
		return html`
			<div class="property-wrapper">
				<label for="frequency" class="d2l-input-label">${ this.localize('step2.frequency.label') } *</label>
				<select id="frequency" class="d2l-input-select" 
					@change="${ this._selectedFrequencyChanged }"
					aria-invalid="${ this.invalidFrequency }">
					<option disabled selected value="">${ this.localize('step2.frequency.placeholder') }</option>
					${ this._renderFrequencyOptions() }
				</select>
				${ this.invalidFrequency ? html`
				<d2l-tooltip for="frequency" state="error" align="start" offset="10" class="one-line-tooltip">
					Schedule Frequency must be selected
				</d2l-tooltip>
				` : ''}
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
				${ this._renderTimeOrDay() }
			</div>
		`;
	}

	_renderTime() {
		return html`
			<div class="property-wrapper">
				<d2l-input-time
					id="time"
					label="${ this.localize('step2.time.label') } *"
					value=${ this.time }
					@change="${ this._selectedTimeChanged }"
					.forceInvalid="${ this.invalidTime }">
				</d2l-input-time>
				${ this.invalidTime ? html`
				<d2l-tooltip for="time" state="error" align="start" offset="10" class="one-line-tooltip">
					Preferred Time must be selected
				</d2l-tooltip>
				` : ''}
			</div>
		`;
	}

	_renderTimeOrDay() {
		if (this._showTime)
			return this._renderTime();
		else if (this._showDay)
			return this._renderDay();
		else
			return '';
	}

	_renderType() {
		return html`
			<div class="property-wrapper">
				<label for="type" class="d2l-input-label">${ this.localize('step2.type.label') } *</label>
				<select id="type" class="d2l-input-select" 
					@change="${ this._selectedTypeChanged }"
					aria-invalid="${ this.invalidType }">
					<option disabled selected value="">${ this.localize('step2.type.placeholder') }</option>
					<option value="1" .selected="${ this.type === 1 }">${ this.localize('step2.type.full') }</option>
					<option value="2" .selected="${ this.type === 2 }">${ this.localize('step2.type.differential') }</option>
				</select>
				${ this.invalidType ? html`
				<d2l-tooltip for="type" state="error" align="start" offset="10" class="one-line-tooltip">
					Schedule Type must be selected
				</d2l-tooltip>
				` : ''}
			</div>
		`;
	}

	_selectedDayChanged(event) {
		this.day = Number(event.target.value);
		this._validateDay();
		this._commitChanges();
	}

	_selectedFrequencyChanged(event) {
		this.frequency = Number(event.target.value);
		this._validateFrequency();
		this._commitChanges();
	}

	_selectedStartEndDateChanged(event) {
		this.startDate = event.target.startValue;
		this.endDate = event.target.endValue;
		this._commitChanges();
		this._validateStartDate();
		this._validateEndDate();
		this._validateStartBeforeEndDate();
		this.requestUpdate();
	}

	_selectedTimeChanged(event) {
		this.time = event.target.value;
		this._validateTime();
		this._commitChanges();
	}

	_selectedTypeChanged(event) {
		this.type = Number(event.target.value);
		this._validateType();
		this._commitChanges();
	}

	get _showDay() {
		return this.frequency === 1;
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

	_validateDay() {
		this.invalidDay = true || this._showDay && (
			this.day === null ||
			this.day === undefined
		);
	}

	_validateEndDate() {
		this.invalidEndDate = this.endDate === ''
		|| this.endDate === null
		|| this.endDate === undefined;
	}

	_validateFrequency() {
		this.invalidFrequency = this.frequency === null
		|| this.frequency === undefined;
	}

	_validateStartBeforeEndDate() {
		this.startAfterEndDate = new Date(this.endDate) < new Date(this.startDate);
	}

	_validateStartDate() {
		this.invalidStartDate = this.startDate === ''
		|| this.startDate === null
		|| this.startDate === undefined;
	}

	_validateTime() {
		this.invalidTime = this._showTime && (
			this.time === '' ||
			this.time === null ||
			this.time === undefined
		);
	}

	_validateType() {
		this.invalidType = this.type === null
		|| this.type === undefined;
	}

}

customElements.define('d2l-configure-schedule', ConfigureSchedule);
