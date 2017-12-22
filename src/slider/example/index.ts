import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Slider from '../../slider/Slider';
import dojoTheme from '../../themes/dojo/theme';

export class App extends WidgetBase<WidgetProperties> {
	private _theme: {};
	private _tribbleValue: number;
	private _verticalValue: number;
	private _verticalInvalid: boolean;

	themeChange(event: Event) {
		const checked = (event.target as HTMLInputElement).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	onTribbleInput(event: Event) {
		const value = (event.target as HTMLInputElement).value;
		this._tribbleValue = parseFloat(value);
		this.invalidate();
	}

	onVerticalInput(event: Event) {
		const value = parseFloat((event.target as HTMLInputElement).value);
		this._verticalValue = value;
		this._verticalInvalid = value > 50;
		this.invalidate();
	}

	render() {
		const {
			_tribbleValue: tribbleValue = 50,
			_verticalValue: verticalValue = 0,
			_verticalInvalid: verticalInvalid = false
		} = this;

		return v('div', [
			v('label', [
				'Use Dojo Theme ',
				v('input', {
					type: 'checkbox',
					onchange: this.themeChange
				})
			]),
			v('h1', {}, ['Slider with custom output']),
			v('div', { id: 'example-s1' }, [
				w(Slider, {
					key: 's1',
					label: 'How much do you like tribbles?',
					min: 0,
					max: 100,
					output: (value: number) => {
						if (value < 20) {
							return 'I am a Klingon';
						}
						if (value < 40) {
							return 'Tribbles only cause trouble';
						}
						if (value < 60) {
							return 'They\`re kind of cute';
						}
						if (value < 80) {
							return 'Most of my salary goes to tribble food';
						} else {
							return 'I permanently altered the ecology of a planet for my tribbles';
						}
					},
					step: 1,
					value: tribbleValue,
					onChange: this.onTribbleInput,
					onInput: this.onTribbleInput,
					theme: this._theme
				})
			]),
			v('h1', {}, ['Disabled slider']),
			v('div', { id: 'example-s2' }, [
				w(Slider, {
					key: 's2',
					label: 'Stuck at 30',
					min: 0,
					max: 100,
					step: 1,
					value: 30,
					disabled: true,
					theme: this._theme
				})
			]),
			v('h1', {}, ['Vertical slider']),
			v('div', { id: 'example-s3' }, [
				w(Slider, {
					key: 's3',
					label: 'Vertical Slider with default properties. Anything over 50 is invalid:',
					value: verticalValue,
					vertical: true,
					invalid: verticalInvalid,
					output: (value: number) => {
						return v('span', {
							innerHTML: verticalInvalid ? value + ' !' : value + ''
						});
					},
					outputIsTooltip: true,
					onChange: this.onVerticalInput,
					onInput: this.onVerticalInput,
					theme: this._theme
				})
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
