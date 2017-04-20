import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import SubMenu from './SubMenu';

/**
 * Configures a SubMenu web component
 */
export default function createSubMenuElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-sub-menu',
		widgetConstructor: SubMenu,
		attributes: [
			{
				attributeName: 'active',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'animation'
			},
			{
				attributeName: 'expandonclick',
				propertyName: 'expandOnClick',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'focusable',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'hidden',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'hidedelay',
				propertyName: 'hideDelay',
				value: value => Number(value)
			},
			{
				attributeName: 'index',
				value: value => Number(value)
			},
			{
				attributeName: 'hideonblur',
				propertyName: 'hideOnBlur',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'hideonactivate',
				propertyName: 'hideOnActivate',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'labelid',
				propertyName: 'labelId'
			},
			{
				attributeName: 'type'
			}
		],
		properties: [
			{
				propertyName: 'label'
			},
			{
				propertyName: 'labelStyles'
			},
			{
				propertyName: 'menuStyles'
			},
			{
				propertyName: 'parentOrientation'
			},
			{
				propertyName: 'position'
			}
		],
		events: [
			{
				propertyName: 'onRequestHide',
				eventName: 'hide'
			},
			{
				propertyName: 'onRequestShow',
				eventName: 'show'
			}
		]
	};
};
