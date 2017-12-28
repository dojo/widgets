import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import EnhancedTextInput from '../EnhancedTextInput';
import dojoTheme from '../../themes/dojo/theme';

export class App extends WidgetBase<WidgetProperties> {
	private _theme: {};
	private _value1: string;
	private _value2: string;

	themeChange(event: Event) {
		const checked = (event.target as HTMLInputElement).checked;
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
				w(EnhancedTextInput, {
					key: 't1',
					addonBefore: [ '@' ],
					aria: {
						describedBy: 'twitter-desc'
					},
					label: 'Twitter Username',
					type: 'text',
					placeholder: 'username',
					value: this._value1,
					onChange: (event: Event) => {
						this._value1 = (event.target as HTMLInputElement).value;
						this.invalidate();
					},
					theme: this._theme
				}),
				v('span', {
					id: 'twitter-desc'
				}, [ 'Not including the "@" symbol' ]),
				v('br'),
				w(EnhancedTextInput, {
					key: 't2',
					addonBefore: [ '$' ],
					addonAfter: [ '.00' ],
					label: 'Price, rounded to the nearest dollar',
					type: 'number',
					value: this._value2,
					onChange: (event: Event) => {
						this._value2 = (event.target as HTMLInputElement).value;
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
