import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import MenuItem from './MenuItem';

/**
 * Configures a MenuItem web component
 */
export default function createMenuItemElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-menu-item',
		widgetConstructor: MenuItem,
		attributes: [
			{
				attributeName: 'active',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'disabled',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'expanded',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'focusable',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'hasmenu',
				propertyName: 'hasMenu',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'haspopup',
				propertyName: 'hasPopup',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'id'
			},
			{
				attributeName: 'index',
				value: value => Number(value)
			},
			{
				attributeName: 'selected',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'tag'
			},
			{
				attributeName: 'type'
			}
		],
		properties: [
			{
				propertyName: 'controls'
			},
			{
				propertyName: 'properties'
			}
		],
		events: [
			{
				propertyName: 'onClick',
				eventName: 'click'
			},
			{
				propertyName: 'onKeyDown',
				eventName: 'keydown'
			},
			{
				propertyName: 'onMouseDown',
				eventName: 'mousedown'
			}
		]
	};
};
