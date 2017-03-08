import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { v, w } from '@dojo/widget-core/d';
import Slider from '../../slider/Slider';

export const AppBase = StatefulMixin(WidgetBase);
export class App extends AppBase<WidgetProperties> {
	onInput(event: Event) {
		const value = (<HTMLInputElement> event.target).value;
		this.setState({ inputValue: parseFloat(value) });
	}

	render() {
		const {
			inputValue = 50
		} = this.state;

		return v('div', [
			v('fieldset', {}, [
				v('legend', {}, ['Example Range Slider Widget']),
				w(Slider, {
					label: 'slide me!',
					min: 0,
					max: 100,
					step: 1,
					value: <number> inputValue,
					onInput: this.onInput
				})
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
