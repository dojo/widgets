import { getDateFormatter } from '@dojo/framework/i18n/date';
import { DNode } from '@dojo/framework/core/interfaces';
import { v, w } from '@dojo/framework/core/vdom';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import setLocaleData from './setLocaleData';
import TimePicker, { getOptions, TimeUnits } from '../../time-picker/index';

setLocaleData();

const TODAY = new Date();
const getEnglishTime = getDateFormatter({ time: 'short' });

export default class App extends WidgetBase {
	private _options: TimeUnits[] = getOptions();
	private _filteredOptions: TimeUnits[] = [];
	private _values: any = {};
	private _valid?: boolean = undefined;

	getFilteredOptions(key: string | number) {
		const value = this._values[key];
		let matching: TimeUnits[] = [];

		if (value) {
			matching = this._options.filter((option) => {
				const { hour, minute = 0 } = option;
				const hours = hour >= 10 ? hour : `0${hour}`;
				const minutes = minute >= 10 ? minute : `0${minute}`;
				return `${hours}:${minutes}`.indexOf(value) === 0;
			});
		}

		this._filteredOptions = matching.length ? matching : this._options;
		this.invalidate();
	}

	onChange(value: string, key: string | number) {
		this._values[key] = value;
		this.invalidate();
	}

	render(): DNode {
		return v('div', [
			v('h1', ['TimePicker Examples']),
			v(
				'p',
				{
					id: 'description1'
				},
				['Accepts 24-hour time with a leading zero, rounded to the nearest half hour.']
			),

			v('h3', ['Filter options on input']),
			v('div', { id: 'example-filter-on-input' }, [
				w(TimePicker, {
					inputProperties: {
						aria: { describedBy: 'description1' },
						placeholder: 'Enter a value'
					},
					key: '1',
					label: 'Time: ',
					onValue: (value) => {
						this.onChange(value, '1');
					},
					onRequestOptions: this.getFilteredOptions,
					options: this._filteredOptions,
					value: this._values['1']
				})
			]),

			v('h3', ['Open on focus']),
			v('div', { id: 'example-open-on-focus' }, [
				w(TimePicker, {
					inputProperties: {
						aria: { describedBy: 'description1' },
						placeholder: 'Enter a value'
					},
					key: '2',
					label: 'Time: ',
					openOnFocus: true,
					onValue: (value) => {
						this.onChange(value, '2');
					},
					step: 1800,
					value: this._values['2']
				})
			]),

			v('h3', ['Disabled menu items']),
			v(
				'p',
				{
					id: 'description2'
				},
				['Accepts 24-hour time with a leading zero, rounded to the nearest hour.']
			),
			v('div', { id: 'example-disabled-items' }, [
				w(TimePicker, {
					inputProperties: {
						aria: { describedBy: 'description2' },
						placeholder: 'Enter a value'
					},
					isOptionDisabled: (option: TimeUnits) => option.hour >= 12,
					key: '3',
					label: 'Time: ',
					onValue: (value) => {
						this.onChange(value, '3');
					},
					step: 3600,
					value: this._values['3']
				})
			]),

			v('h3', ['Disabled']),
			v('div', { id: 'example-disabled' }, [
				w(TimePicker, {
					inputProperties: {
						aria: { describedBy: 'description1' },
						placeholder: 'Enter a value'
					},
					key: '4',
					label: 'Time: ',
					disabled: true
				})
			]),

			v('h3', ['Read Only']),
			v('div', { id: 'example-readonly' }, [
				w(TimePicker, {
					inputProperties: {
						aria: { describedBy: 'description1' },
						placeholder: 'Enter a value'
					},
					key: '5',
					label: 'Time: ',
					readOnly: true
				})
			]),

			v('h3', ['Labeled']),
			v('div', { id: 'example-labeled' }, [
				w(TimePicker, {
					key: '6',
					inputProperties: {
						aria: { describedBy: 'description1' }
					},
					label: 'Enter a value',
					onValue: (value) => {
						this.onChange(value, '6');
					},
					step: 1800,
					value: this._values['6']
				})
			]),

			v('h3', ['Required and validated']),
			v('div', { id: 'example-required-validated' }, [
				w(TimePicker, {
					inputProperties: {
						aria: { describedBy: 'description1' },
						placeholder: 'Enter a value'
					},
					valid: this._valid,
					key: '7',
					required: true,
					onValue: (value) => {
						this._valid = value.trim().length > 0;
						this.onChange(value, '7');
					},
					label: 'Time: ',
					step: 1800,
					value: this._values['7']
				})
			]),

			v('h3', ['One second increment']),
			v(
				'p',
				{
					id: 'description8'
				},
				['Accepts 24-hour time with a leading zero, rounded to the nearest second.']
			),
			v('div', { id: 'example-every-second' }, [
				w(TimePicker, {
					end: '12:00:59',
					inputProperties: {
						aria: { describedBy: 'description8' },
						placeholder: 'Enter a value'
					},
					key: '8',
					label: 'Time: ',
					onValue: (value) => {
						this.onChange(value, '8');
					},
					start: '12:00:00',
					step: 1,
					value: this._values['8']
				})
			]),

			v('h3', ['Use 12-hour time']),
			v(
				'p',
				{
					id: 'description9'
				},
				['Accepts 12-hour time without a leading zero, rounded to the nearest half hour.']
			),
			v('div', { id: 'example-12-hour' }, [
				w(TimePicker, {
					getOptionLabel: (option: TimeUnits) => {
						TODAY.setHours(option.hour);
						TODAY.setMinutes(option.minute as number);
						return getEnglishTime(TODAY);
					},
					inputProperties: {
						aria: { describedBy: 'description9' },
						placeholder: 'Enter a value'
					},
					key: '9',
					label: 'Time: ',
					onValue: (value) => {
						this.onChange(value, '9');
					},
					step: 1800,
					value: this._values['9']
				})
			]),

			v('h3', ['Native `<input type="time">`']),
			v('div', { id: 'example-native' }, [
				w(TimePicker, {
					key: '10',
					inputProperties: {
						aria: { describedBy: 'description1' },
						placeholder: 'Enter a value'
					},
					onValue: (value) => {
						this.onChange(value, '10');
					},
					step: 1800,
					useNativeElement: true,
					valid: false,
					label: 'foo',
					value: this._values['10']
				})
			])
		]);
	}
}
