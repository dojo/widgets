import { DNode } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import TimePicker, { TimeUnits } from '../TimePicker';

export class App extends StatefulMixin(WidgetBase)<WidgetProperties> {
	onRequestOptions(value: string, getOptions: () => TimeUnits[]) {
		this.setState({ options: getOptions() });
	}

	render(): DNode {
		return v('div', [
			v('h1', [ 'TimePicker Examples' ]),
			v('h3', [ 'Filter options on input' ]),
			w(TimePicker, {
				key: '7',
				options: <TimeUnits[]> this.state.options,
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
				step: 1800,
				value: <string> this.state['value7'],
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', [ 'Open on focus' ]),
			w(TimePicker, {
				key: '1',
				openOnFocus: true,
				onChange: (value: string) => this.setState({ 'value1': value }),
				onRequestOptions: this.onRequestOptions,
				options: <TimeUnits[]> this.state.options,
				step: 1800,
				value: <string> this.state['value1'],
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', [ 'Disabled menu items' ]),
			w(TimePicker, {
				key: '2',
				onChange: (value: string) => this.setState({ 'value2': value }),
				onRequestOptions: this.onRequestOptions,
				options: <TimeUnits[]> this.state.options,
				step: 3600,
				value: <string> this.state['value2'],
				isOptionDisabled: (option: TimeUnits) => option.hour >= 12,
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', [ 'Disabled' ]),
			w(TimePicker, {
				key: '3',
				disabled: true,
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', [ 'Read Only' ]),
			w(TimePicker, {
				key: '4',
				readOnly: true,
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', [ 'Label' ]),
			w(TimePicker, {
				key: '5',
				onChange: (value: string) => this.setState({ 'value5': value }),
				onRequestOptions: this.onRequestOptions,
				options: <TimeUnits[]> this.state.options,
				step: 1800,
				value: <string> this.state['value5'],
				label: 'Enter a value'
			}),
			v('h3', [ 'Required and validated' ]),
			w(TimePicker, {
				key: '6',
				required: true,
				onChange: (value: string) => this.setState({
					'value6': value,
					invalid: value.trim().length === 0
				}),
				onRequestOptions: this.onRequestOptions,
				options: <TimeUnits[]> this.state.options,
				step: 1800,
				value: <string> this.state['value6'],
				invalid: <boolean> this.state.invalid,
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', [ 'One second increment' ]),
			w(TimePicker, {
				end: '12:00:59',
				key: '8',
				options: <TimeUnits[]> this.state.options,
				onChange: (value: string) => this.setState({ 'value8': value }),
				onRequestOptions: this.onRequestOptions,
				start: '12:00:00',
				step: 1,
				value: <string> this.state['value8'],
				inputProperties: {
					placeholder: 'Enter a value'
				}
			}),
			v('h3', [ 'Native `<input type="time">`' ]),
			w(TimePicker, {
				key: '9',
				inputProperties: {
					placeholder: 'Enter a value'
				},
				onChange: (value: string) => this.setState({ 'value9': value }),
				useNativeElement: true,
				value: <string> this.state['value9']
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
