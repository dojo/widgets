import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties, TypedTargetEvent } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Radio from '../../radio/Radio';
import dojoTheme from '../../themes/dojo/theme';

export class App extends WidgetBase<WidgetProperties> {
	private _theme: {};
	private _inputValue: string;

	themeChange(event: TypedTargetEvent<HTMLInputElement>) {
		const checked = event.target.checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	onChange(event: TypedTargetEvent<HTMLInputElement>) {
		const value = event.target.value;
		this._inputValue = value;
		this.invalidate();
	}

	render() {
		const {
			_inputValue = 'first'
		} = this;

		return v('div', [
			v('h2', {
				innerHTML: 'Radio Examples'
			}),
			v('label', [
				'Use Dojo Theme ',
				v('input', {
					type: 'checkbox',
					onchange: this.themeChange
				})
			]),
			v('fieldset', { id: 'example-1' }, [
				v('legend', {}, ['Set of radio buttons with first option selected']),
				w(Radio, {
					key: 'r1',
					checked: this._inputValue === 'first',
					value: 'first',
					label: 'First option',
					name: 'sample-radios',
					onChange: this.onChange,
					theme: this._theme
				}),
				w(Radio, {
					key: 'r2',
					checked: this._inputValue === 'second',
					value: 'second',
					label: 'Second option',
					name: 'sample-radios',
					onChange: this.onChange,
					theme: this._theme
				}),
				w(Radio, {
					key: 'r3',
					checked: this._inputValue === 'third',
					value: 'third',
					label: 'Third option',
					name: 'sample-radios',
					onChange: this.onChange,
					theme: this._theme
				})
			]),
			v('fieldset', { id: 'example-2' }, [
				v('legend', {}, ['Set of disabled radio buttons']),
				w(Radio, {
					key: 'r4',
					checked: false,
					disabled: true,
					label: 'First option',
					name: 'sample-radios-disabled',
					theme: this._theme
				}),
				w(Radio, {
					key: 'r5',
					checked: true,
					disabled: true,
					label: 'Second option',
					name: 'sample-radios-disabled',
					theme: this._theme
				})
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
