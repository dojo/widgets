import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import MenuBar from './MenuBar';

/**
 * Configures a MenuBar web component
 */
export default function createMenuBarElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-menu-bar',
		widgetConstructor: MenuBar,
		attributes: [
			{
				attributeName: 'breakpoint',
				value: value => Number(value)
			},
			{
				attributeName: 'open',
				value: value => value === 'false' || value === '0' ? false : true
			}
		],
		properties: [
			{
				propertyName: 'slidePaneStyles'
			},
			{
				propertyName: 'slidePaneTrigger'
			}
		],
		events: [
			{
				propertyName: 'onRequestClose',
				eventName: 'close'
			},
			{
				propertyName: 'onRequestOpen',
				eventName: 'open'
			}
		]
	};
};
