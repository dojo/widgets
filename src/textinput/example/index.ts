import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import TextInput from '../../textinput/TextInput';
import dojoTheme from '../../themes/dojo/theme';

export const AppBase = StatefulMixin(WidgetBase);
export class App extends AppBase<WidgetProperties> {
	private _theme: {};

	themeChange(event: Event) {
		const checked = (<HTMLInputElement> event.target).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	render() {
		return v('div', [
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
					value: this.state.value1,
					onChange: (event: Event) => {
						this.setState({ value1: (<HTMLInputElement> event.target).value });
					},
					theme: this._theme
				})
			]),
			v('div', { id: 'example-email' }, [
				v('h3', {}, ['Label before the input']),
				w(TextInput, {
					key: 't2',
					type: 'email',
					label: {
						before: true,
						content: 'Email (required)'
					},
					required: true,
					value: this.state.value2,
					onChange: (event: Event) => {
						this.setState({ value2: (<HTMLInputElement> event.target).value });
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
					label: {
						content: 'Try listening to me!',
						before: false,
						hidden: true
					},
					value: this.state.value3,
					onChange: (event: Event) => {
						this.setState({ value3: (<HTMLInputElement> event.target).value });
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
					value: this.state.value4,
					invalid: this.state.invalid,
					onChange: (event: Event) => {
						const value = (<HTMLInputElement> event.target).value;
						this.setState({ value4: value });
						this.setState({ invalid: value.toLowerCase() !== 'foo' && value.toLowerCase() !== 'bar' });
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
