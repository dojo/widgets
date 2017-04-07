import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { v, w } from '@dojo/widget-core/d';
import Slider from '../../slider/Slider';
import dojoTheme from '../../themes/dojo/theme';

export const AppBase = StatefulMixin(WidgetBase);
export class App extends AppBase<WidgetProperties> {
	private _theme: {};

	themeChange(event: Event) {
		const checked = (<HTMLInputElement> event.target).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	onTribbleInput(event: Event) {
		const value = (<HTMLInputElement> event.target).value;
		this.setState({ tribbleValue: parseFloat(value) });
	}

	onVerticalInput(event: Event) {
		const value = parseFloat((<HTMLInputElement> event.target).value);
		this.setState({
			verticalValue: value,
			verticalInvalid: value > 50 ? true : false
		});
	}

	render() {
		const {
			tribbleValue = 50,
			verticalValue = 0,
			verticalInvalid = false
		} = this.state;

		return v('div', [
			v('label', [
				'Use Dojo Theme ',
				v('input', {
					type: 'checkbox',
					onchange: this.themeChange
				})
			]),
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
				onInput: this.onTribbleInput,
				theme: this._theme
			}),
			v('h1', {}, ['Vertical slider']),
			w(Slider, {
				key: 's2',
				label: 'Vertical Slider with default properties. Anything over 50 is invalid:',
				value: <number> verticalValue,
				vertical: true,
				invalid: <boolean> verticalInvalid,
				output: (value: number) => {
					return v('span', {
						innerHTML: verticalInvalid ? value + ' !' : value + '',
						styles: {
							position: 'absolute',
							left: '30px',
							top: (100 - value) + '%',
							marginTop: '-10px',
							padding: '5px'
						}
					});
				},
				onInput: this.onVerticalInput,
				theme: this._theme
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
