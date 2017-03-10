import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { v, w } from '@dojo/widget-core/d';
import Slider from '../../slider/Slider';

export const AppBase = StatefulMixin(WidgetBase);
export class App extends AppBase<WidgetProperties> {
	onTribbleInput(event: Event) {
		const value = (<HTMLInputElement> event.target).value;
		this.setState({ tribbleValue: parseFloat(value) });
	}

	onVerticalInput(event: Event) {
		const value = (<HTMLInputElement> event.target).value;
		this.setState({ verticalValue: parseFloat(value) });
	}

	render() {
		const {
			tribbleValue = 50,
			verticalValue = 0
		} = this.state;

		return v('div', [
			v('h1', {}, ['Slider with custom output']),
			w(Slider, {
				key: 's1',
				label: 'How much do you like tribbles?',
				min: 0,
				max: 100,
				output: (value: number) => {
					if (value < 20) { return 'I am a Klingon'; }
					if (value < 40) { return 'Tribbles only cause trouble'; }
					if (value < 60) { return 'They\`re kind of cute'; }
					if (value < 80) { return 'Most of my salary goes to tribble food'; }
					else { return 'I permanently altered the ecology of a planet for my tribbles'; }
				},
				step: 1,
				value: <number> tribbleValue,
				onInput: this.onTribbleInput
			}),
			v('h1', {}, ['Vertical slider']),
			w(Slider, {
				key: 's2',
				label: 'Something label moose',
				value: <number> verticalValue,
				vertical: true,
				onInput: this.onVerticalInput
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
