import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import createDialog from './createDialog';

/**
 * Configures a Dialog web component
 *
 * @return	{CustomElementDescriptor?}
 */
export default function createDialogElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-dialog',
		widgetFactory: createDialog,
		attributes: [
			{
				attributeName: 'closeable',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'enterAnimation'
			},
			{
				attributeName: 'exitAnimation'
			},
			{
				attributeName: 'modal',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'open',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'role'
			},
			{
				attributeName: 'title'
			},
			{
				attributeName: 'underlay',
				value: value => value === 'false' || value === '0' ? false : true
			}
		],
		events: [
			{
				propertyName: 'onOpen',
				eventName: 'open'
			},
			{
				propertyName: 'onRequestClose',
				eventName: 'requestClose'
			}
		]
	};
};
