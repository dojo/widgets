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
				value: value => Boolean(value)
			},
			{
				attributeName: 'enterAnimation'
			},
			{
				attributeName: 'exitAnimation'
			},
			{
				attributeName: 'modal',
				value: value => Boolean(value)
			},
			{
				attributeName: 'open',
				value: value => Boolean(value)
			},
			{
				attributeName: 'role'
			},
			{
				attributeName: 'title'
			},
			{
				attributeName: 'underlay',
				value: value => Boolean(value)
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
