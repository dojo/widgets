import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import Toolbar from './Toolbar';

/**
 * Configures a Toolbar web component
 */
export default function createToolbarElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-toolbar',
		widgetConstructor: Toolbar,
		attributes: [
			{
				attributeName: 'collapseWidth',
				value: (value) => Number(value)
			},
			{
				attributeName: 'fixed',
				value: (value) => (value === 'false' || value === '0' ? false : true)
			},
			{
				attributeName: 'title'
			}
		],
		properties: [{ propertyName: 'actions' }, { propertyName: 'theme' }],
		events: [
			{
				propertyName: 'onCollapse',
				eventName: 'collapse'
			}
		]
	};
}
