import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { ProjectorMixin } from '@dojo/framework/widget-core/mixins/Projector';
import { v, w } from '@dojo/framework/widget-core/d';
import EnhancedTextInput from '../../enhanced-text-input/index';

export class App extends WidgetBase {
	private _value1: string | undefined;
	private _value2: string | undefined;

	render() {
		return v('div', {
			styles: { maxWidth: '256px' }
		}, [
			v('h2', {}, ['Text Input Examples']),
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
					onChange: (value: string) => {
						this._value1 = value;
						this.invalidate();
					}
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
					onChange: (value: string) => {
						this._value2 = value;
						this.invalidate();
					}
				})
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
