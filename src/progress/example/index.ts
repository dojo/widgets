import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/framework/widget-core/interfaces';
import renderer from '@dojo/framework/widget-core/vdom';
import { v, w } from '@dojo/framework/widget-core/d';
import Progress from '../../progress/index';

const customOutputMax = 750;
function customOutput(value: number, percent: number) {
	return `${value} of ${customOutputMax} is ${percent}%`;
}

export class App extends WidgetBase<WidgetProperties> {
	render() {
		return v('div', [
			v('h1', {}, ['Progress Examples']),
			v('h3', {}, ['Progress with 50% value']),
			v('div', { id: 'example-1'}, [
				w(Progress, { value: 50 })
			]),
			v('h3', {}, ['Progress with an id']),
			v('div', { id: 'example-2'}, [
				w(Progress, { value: 80, widgetId: 'progress-2' })
			]),
			v('h3', {}, ['Progress with max']),
			v('div', { id: 'example-3'}, [
				w(Progress, { value: 0.3, max: 1 })
			]),
			v('h3', {}, ['Progress with custom output']),
			v('div', { id: 'example-4'}, [
				w(Progress, {
					value: 250,
					max: customOutputMax,
					output: customOutput
				})
			]),
			v('h3', {}, ['Progress with no output']),
			v('div', { id: 'example-5'}, [
				w(Progress, { value: 10, showOutput: false })
			])
		]);
	}
}

const r = renderer(() => w(App, {}));
r.mount();
