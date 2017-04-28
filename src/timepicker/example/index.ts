import { DNode } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import TimePicker, { TimeUnits } from '../TimePicker';
import dojoTheme from '../../themes/dojo/theme';

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	private _theme: {};

	onRequestOptions(value: string, getOptions: () => TimeUnits[]) {
		this.setState({ options: getOptions() });
	}

	themeChange(event: Event) {
		const checked = (<HTMLInputElement> event.target).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	render(): DNode {
		return v('div', [
			v('h1', [ 'TimePicker Examples' ]),
			v('label', [
				'Use Dojo Theme ',
				v('input', {
					type: 'checkbox',
					onchange: this.themeChange
				})
			]),
			v('h3', [ 'Filter options on input' ]),
			w(TimePicker, {
				inputProperties: {
					placeholder: 'Enter a value'
				},
				key: '7',
				onChange: (value: string) => this.setState({ 'value7': value }),
				onRequestOptions: (value: string, getOptions: () => TimeUnits[]) => {
					const options = getOptions();

					if (!value) {
						return this.setState({ options });
					}

					const matching = options.filter(option => {
						const { hour, minute = 0 } = option;
						const hours = hour >= 10 ? hour : `0${hour}`;
						const minutes = minute >= 10 ? minute : `0${minute}`;
						return `${hours}:${minutes}`.indexOf(value) === 0;
					});

					this.setState({
						options: matching.length ? matching : options
					});
				},
				options: <TimeUnits[]> this.state.options,
				step: 1800,
				theme: this._theme,
				value: <string> this.state['value7']
			}),
			v('h3', [ 'Open on focus' ]),
			w(TimePicker, {
				inputProperties: {
					placeholder: 'Enter a value'
				},
				key: '1',
				openOnFocus: true,
				onChange: (value: string) => this.setState({ 'value1': value }),
				onRequestOptions: this.onRequestOptions,
				options: <TimeUnits[]> this.state.options,
				step: 1800,
				theme: this._theme,
				value: <string> this.state['value1']
			}),
			v('h3', [ 'Disabled menu items' ]),
			w(TimePicker, {
				inputProperties: {
					placeholder: 'Enter a value'
				},
				isOptionDisabled: (option: TimeUnits) => option.hour >= 12,
				key: '2',
				onChange: (value: string) => this.setState({ 'value2': value }),
				onRequestOptions: this.onRequestOptions,
				options: <TimeUnits[]> this.state.options,
				step: 3600,
				theme: this._theme,
				value: <string> this.state['value2']
			}),
			v('h3', [ 'Disabled' ]),
			w(TimePicker, {
				inputProperties: {
					placeholder: 'Enter a value'
				},
				key: '3',
				disabled: true,
				theme: this._theme
			}),
			v('h3', [ 'Read Only' ]),
			w(TimePicker, {
				inputProperties: {
					placeholder: 'Enter a value'
				},
				key: '4',
				readOnly: true,
				theme: this._theme
			}),
			v('h3', [ 'Label' ]),
			w(TimePicker, {
				key: '5',
				label: 'Enter a value',
				onChange: (value: string) => this.setState({ 'value5': value }),
				onRequestOptions: this.onRequestOptions,
				options: <TimeUnits[]> this.state.options,
				step: 1800,
				theme: this._theme,
				value: <string> this.state['value5']
			}),
			v('h3', [ 'Required and validated' ]),
			w(TimePicker, {
				inputProperties: {
					placeholder: 'Enter a value'
				},
				invalid: <boolean> this.state.invalid,
				key: '6',
				required: true,
				onBlur: (value: string) => this.setState({
					invalid: value.trim().length === 0
				}),
				onChange: (value: string) => this.setState({
					'value6': value,
					invalid: value.trim().length === 0
				}),
				onRequestOptions: this.onRequestOptions,
				options: <TimeUnits[]> this.state.options,
				step: 1800,
				theme: this._theme,
				value: <string> this.state['value6']
			}),
			v('h3', [ 'One second increment' ]),
			w(TimePicker, {
				end: '12:00:59',
				inputProperties: {
					placeholder: 'Enter a value'
				},
				key: '8',
				options: <TimeUnits[]> this.state.options,
				onChange: (value: string) => this.setState({ 'value8': value }),
				onRequestOptions: this.onRequestOptions,
				start: '12:00:00',
				step: 1,
				theme: this._theme,
				value: <string> this.state['value8']
			}),
			v('h3', [ 'Native `<input type="time">`' ]),
			w(TimePicker, {
				key: '9',
				inputProperties: {
					placeholder: 'Enter a value'
				},
				onChange: (value: string) => this.setState({ 'value9': value }),
				theme: this._theme,
				useNativeElement: true,
				value: <string> this.state['value9']
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
