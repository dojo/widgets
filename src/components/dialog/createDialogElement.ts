import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import createDialog from './createDialog';

export default function createDialogElement(): CustomElementDescriptor {
	return {
		tagName: 'dialog-element',
		widgetFactory: createDialog,
		attributes: [
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
