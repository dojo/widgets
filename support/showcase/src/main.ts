import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

export default class App extends WidgetBase<WidgetProperties> {
	protected render(): DNode {
		return v('div', [ 'locked and loaded' ]);
	}
}

const root = document.querySelector('showcase') || undefined;
const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append(root);
