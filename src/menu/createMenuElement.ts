import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import Menu from './Menu';

/**
 * Configures a Menu web component
 */
export default function createMenuElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-menu',
		widgetConstructor: Menu,
		attributes: [
			{
				attributeName: 'active',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'activeindex',
				propertyName: 'activeIndex',
				value: value => Number(value)
			},
			{
				attributeName: 'disabled',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'id'
			},
			{
				attributeName: 'role'
			}
		],
		properties: [
			{
				propertyName: 'orientation'
			}
		]
	};
};
