import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Label from '../../label/Label';

const AppBase = StatefulMixin(WidgetBase);

export class App extends AppBase<WidgetProperties> {
	render() {
		return v('div', [
			v('h1', {}, ['Label Examples']),
			v('h3', {}, ['Label assigned as string without extra options']),
			w(Label, {
				label: 'Type something'
			}, [
				v('input', {
					type: 'text',
					placeholder: '...'
				})
			]),
			v('h3', {}, ['Hidden label after the input']),
			w(Label, {
				label: {
					content: 'Can\'t read me!',
					hidden: true,
					before: false
				}
			}, [
				v('input', {
					type: 'text',
					placeholder: 'Type something'
				})
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
