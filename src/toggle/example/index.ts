import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Toggle from '../../toggle/index';

export class App extends WidgetBase<WidgetProperties> {
	private _toggleStates: { [key: string]: boolean } = {
		c1: true,
		c2: false,
		c3: false,
		c4: false,
		c5: true
	};

	onChange(value: string, checked: boolean) {
		this._toggleStates[value] = checked;
		this.invalidate();
	}

	render() {
		const {
			c1 = true,
			c2 = false,
			c3 = false
		} = this._toggleStates;

		return v('div', [
			v('h2', {
				innerHTML: 'Toggle Examples'
			}),
			v('fieldset', [
				v('legend', {}, ['Toggle Example']),
				v('div', { id: 'example-1' }, [
					w(Toggle, {
						key: 'c1',
						checked: c1,
						label: 'Sample toggle that starts checked',
						onLabel: 'On',
						offLabel: 'Off',
						value: 'c1',
						onChange: this.onChange
					})
				]),

				v('div', { id: 'example-2' }, [
					w(Toggle, {
						key: 'c2',
						checked: c2,
						label: 'Sample disabled toggle',
						onLabel: 'On',
						offLabel: 'Off',
						disabled: true,
						value: 'c2',
						onChange: this.onChange
					})
				]),

				v('div', { id: 'example-3' }, [
					w(Toggle, {
						key: 'c3',
						checked: c3,
						label: 'Required toggle',
						onLabel: 'On',
						offLabel: 'Off',
						required: true,
						value: 'c3',
						onChange: this.onChange
					})
				])
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
