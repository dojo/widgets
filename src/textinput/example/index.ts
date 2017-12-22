import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import TextInput from '../../textinput/TextInput';
import dojoTheme from '../../themes/dojo/theme';

export class App extends WidgetBase<WidgetProperties> {
	private _theme: {};
	private _value1: string;
	private _value2: string;
	private _value3: string;
	private _value4: string;
	private _invalid: boolean;

	themeChange(event: Event) {
		const checked = (event.target as HTMLInputElement).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	// prettier-ignore
	render() {
		return v('div', {
			styles: { maxWidth: '256px' }
		}, [
			v('h2', {}, ['Text Input Examples']),
			v('label', [
				'Use Dojo Theme ',
				v('input', {
					type: 'checkbox',
					onchange: this.themeChange
				})
			]),
			v('div', { id: 'example-text' }, [
				v('h3', {}, ['String label']),
				w(TextInput, {
					key: 't1',
					label: 'Name',
					type: 'text',
					placeholder: 'Hello, World',
					value: this._value1,
					onChange: (event: Event) => {
						this._value1 = (event.target as HTMLInputElement).value;
						this.invalidate();
					},
					theme: this._theme
				})
			]),
			v('div', { id: 'example-email' }, [
				v('h3', {}, ['Label before the input']),
				w(TextInput, {
					key: 't2',
					type: 'email',
					label: 'Email (required)',
					required: true,
					value: this._value2,
					onChange: (event: Event) => {
						this._value2 = (event.target as HTMLInputElement).value;
						this.invalidate();
					},
					theme: this._theme
				})
			]),
			v('div', { id: 'example-hidden-label' }, [
				v('h3', {}, ['Hidden accessible label']),
				w(TextInput, {
					key: 't3',
					type: 'text',
					placeholder: 'Type something...',
					label: 'Try listening to me!',
					labelAfter: true,
					labelHidden: true,
					value: this._value3,
					onChange: (event: Event) => {
						this._value3 = (event.target as HTMLInputElement).value;
						this.invalidate();
					},
					theme: this._theme
				})
			]),
			v('div', { id: 'example-disabled' }, [
				v('h3', {}, ['Disabled text input']),
				w(TextInput, {
					key: 't4',
					type: 'text',
					label: 'Can\'t type here',
					value: 'Initial value',
					disabled: true,
					readOnly: true,
					theme: this._theme
				})
			]),
			v('div', { id: 'example-validated' }, [
				v('h3', {}, ['Validated Input']),
				w(TextInput, {
					key: 't5',
					type: 'text',
					label: 'Type "foo" or "bar"',
					value: this._value4,
					invalid: this._invalid,
					onInput: (event: Event) => {
						const target = event.target as HTMLInputElement;
						const value = target.value;
						this._value4 = value;
						this._invalid = value.toLowerCase() !== 'foo' && value.toLowerCase() !== 'bar';
						this.invalidate();
					},
					theme: this._theme
				})
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
