import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties, TypedTargetEvent } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Textarea from '../../textarea/Textarea';
import dojoTheme from '../../themes/dojo/theme';

export class App extends WidgetBase<WidgetProperties> {
	private _theme: {};
	private _value1: string;
	private _value2: string;
	private _invalid: boolean;

	themeChange(event: TypedTargetEvent<HTMLInputElement>) {
		const checked = event.target.checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	render() {
		return v('div', [
			v('h2', {}, ['Textarea Example']),
			v('label', [
				'Use Dojo Theme ',
				v('input', {
					type: 'checkbox',
					onchange: this.themeChange
				})
			]),
			v('div', { id: 'example-t1'}, [
				w(Textarea, {
					key: 't1',
					columns: 40,
					rows: 8,
					placeholder: 'Hello, World',
					label: 'Type Something',
					value: this._value1,
					onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
						this._value1 = event.target.value;
						this.invalidate();
					},
					theme: this._theme
				})
			]),
			v('h3', {}, ['Disabled Textarea']),
			v('div', { id: 'example-t2'}, [
				w(Textarea, {
					key: 't2',
					columns: 40,
					rows: 3,
					label: 'Can\'t type here',
					value: 'Initial value',
					disabled: true,
					theme: this._theme
				})
			]),
			v('h3', {}, ['Validated, Required Textarea']),
			v('div', { id: 'example-t3'}, [
				w(Textarea, {
					key: 't3',
					columns: 40,
					rows: 8,
					label: 'Required',
					required: true,
					value: this._value2,
					invalid: this._invalid,
					onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
						const value = event.target.value;
						this._value2 = value;
						this._invalid = value.trim().length === 0;
						this.invalidate();
					},
					theme: this._theme
				})
			]),
			v('h3', {}, ['Hidden Label Textarea']),
			v('div', { id: 'example-t4'}, [
				w(Textarea, {
					key: 't4',
					columns: 40,
					rows: 8,
					label: {
						content: 'Hidden label',
						before: false,
						hidden: true
					}
				})
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
