import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { v, w } from '@dojo/framework/core/vdom';
import Radio from '../../radio/index';

export default class App extends WidgetBase {
	private _inputValue: string | undefined;

	onValue(value: string) {
		this._inputValue = value;
		this.invalidate();
	}

	render() {
		const { _inputValue = 'first' } = this;

		return v('div', [
			v('h2', {
				innerHTML: 'Radio Examples'
			}),
			v('fieldset', { id: 'example-1' }, [
				v('legend', {}, ['Set of radio buttons with first option selected']),
				w(Radio, {
					key: 'r1',
					checked: _inputValue === 'first',
					value: 'first',
					label: 'First option',
					name: 'sample-radios',
					onValue: (checked) => {
						if (checked) {
							this.onValue('first');
						}
					}
				}),
				w(Radio, {
					key: 'r2',
					checked: this._inputValue === 'second',
					value: 'second',
					label: 'Second option',
					name: 'sample-radios',
					onValue: (checked) => {
						if (checked) {
							this.onValue('second');
						}
					}
				}),
				w(Radio, {
					key: 'r3',
					checked: this._inputValue === 'third',
					value: 'third',
					label: 'Third option',
					name: 'sample-radios',
					onValue: (checked) => {
						if (checked) {
							this.onValue('third');
						}
					}
				})
			]),
			v('fieldset', { id: 'example-2' }, [
				v('legend', {}, ['Set of disabled radio buttons']),
				w(Radio, {
					key: 'r4',
					checked: false,
					disabled: true,
					label: 'First option',
					name: 'sample-radios-disabled'
				}),
				w(Radio, {
					key: 'r5',
					checked: true,
					disabled: true,
					label: 'Second option',
					name: 'sample-radios-disabled'
				})
			])
		]);
	}
}
