import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import customElement from '@dojo/widget-core/decorators/customElement';
import { VNode } from '@dojo/widget-core/interfaces';

export interface DomWidgetProperties {
	tag: string;
	classes?: string;
	label?: string;
}

@customElement<DomWidgetProperties>({
	tag: 'dojo-dom',
	attributes: [ 'tag', 'label', 'classes' ]
})
export class DomWidget extends WidgetBase<DomWidgetProperties> {
	protected render(): VNode {
		const { tag, classes = '', label } = this.properties;
		const parsedClasses = classes.split(' ');
		return v(tag, { classes: parsedClasses }, [
			label ? label : null,
			...this.children
		]);
	}
}

export default DomWidget;
