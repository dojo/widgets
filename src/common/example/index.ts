import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import Select from '../../select/Select';
import { v, w } from '@dojo/widget-core/d';

const modules = [
	'accordionpane',
	'button',
	'calendar',
	'checkbox',
	'combobox',
	'dialog',
	'label',
	'radio',
	'select',
	'slidepane',
	'slider',
	'splitpane',
	'tabcontroller',
	'textarea',
	'textinput',
	'timepicker',
	'titlepane'
];

export class App extends WidgetBase<WidgetProperties> {
	onModuleChange(event: any) {
		const module = event.value;
		window.location.search = `?module=${module}`;
	}

	render() {
		return v('div', [
			v('h2', {
				innerHTML: 'Select a module to view'
			}),
			w(Select, { onChange: this.onModuleChange, useNativeElement: true, options: [
				{ label: 'Pick a module', value: '', disabled: true, selected: true },
				...modules.map((module) => {
					return { value: module, label: module };
				})
			]})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
