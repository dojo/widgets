import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Label from '../../label/index';

export class App extends WidgetBase<WidgetProperties> {
	render() {
		return v('div', [
			v('h1', {}, ['Label Examples']),
			v('h3', {}, ['Label assigned as string without extra options']),
			v('div', { id: 'example-1'}, [
				w(Label, {}, [ 'Type Something' ])
			]),
			v('h3', {}, ['Hidden label']),
			v('div', { id: 'example-2'}, [
				w(Label, { hidden: true }, [ 'Can\'t read me!' ])
			]),
			v('h3', {}, ['Label with Input']),
			v('div', { id: 'example-3'}, [
				w(Label, { forId: 'input-1' }, [ 'Type Something' ]),
				v('input', { id: 'input-1' })
			]),
			v('h3', {}, ['Required Label']),
			v('div', { id: 'example-4'}, [
				w(Label, { required: true }, [ 'I\'m required' ])
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
