import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import Tab from './Tab';

/**
 * Configures a Tab web component
 */

export default function createTabElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-tab',
		widgetConstructor: Tab,
		attributes: [
			{
				attributeName: 'closeable',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'disabled',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'key'
			}
		],
		properties: [
			{ propertyName: 'label' },
			{ propertyName: 'theme' }
		]
	};
};
