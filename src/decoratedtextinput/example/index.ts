import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties, TypedTargetEvent } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import DecoratedTextInput from '../DecoratedTextInput';
import dojoTheme from '../../themes/dojo/theme';

export class App extends WidgetBase<WidgetProperties> {
	private _theme: {};
	private _value1: string;
	private _value2: string;

	themeChange(event: Event) {
		const checked = (<HTMLInputElement> event.target).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

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
				w(DecoratedTextInput, {
					key: 't1',
					addonBefore: [ '@' ],
					describedBy: 'twitter-desc',
					label: 'Twitter Username',
					type: 'text',
					placeholder: 'username',
					value: this._value1,
					onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
						this._value1 = event.target.value;
						this.invalidate();
					},
					theme: this._theme
				}),
				v('span', {
					id: 'twitter-desc'
				}, [ 'Not including the "@" symbol' ]),
				v('br'),
				w(DecoratedTextInput, {
					key: 't2',
					addonBefore: [ '$' ],
					addonAfter: [ '.00' ],
					label: 'Price, rounded to the nearest dollar',
					type: 'number',
					value: this._value2,
					onChange: (event: TypedTargetEvent<HTMLInputElement>) => {
						this._value2 = event.target.value;
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
