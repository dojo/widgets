import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Progress from '../../progress/Progress';
import dojoTheme from '../../themes/dojo/theme';

const customOutputMax = 750;
function customOutput(value: number, percent: number) {
	return `${value} of ${customOutputMax} is ${percent}%`;
}

export class App extends WidgetBase<WidgetProperties> {
	private _theme: {};

	themeChange(event: Event) {
		const checked = (event.target as HTMLInputElement).checked;
		this._theme = checked ? dojoTheme : {};
		this.invalidate();
	}

	render() {
		return v('div', [
			v('h1', {}, ['Progress Examples']),
			v('label', [
				'Use Dojo Theme ',
				v('input', {
					type: 'checkbox',
					onchange: this.themeChange
				})
			]),
			v('h3', {}, ['Progress with 50% value']),
			v('div', { id: 'example-1'}, [
				w(Progress, { value: 50, theme: this._theme })
			]),
			v('h3', {}, ['Progress with max']),
			v('div', { id: 'example-2'}, [
				w(Progress, { value: 0.3, max: 1, theme: this._theme })
			]),
			v('h3', {}, ['Progress with custom output']),
			v('div', { id: 'example-3'}, [
				w(Progress, {
					value: 250,
					max: customOutputMax,
					output: customOutput,
					theme: this._theme
				})
			]),
			v('h3', {}, ['Progress with no output']),
			v('div', { id: 'example-3'}, [
				w(Progress, { value: 10, showOutput: false, theme: this._theme })
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
