import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import Dialog from './Dialog';

/**
 * Configures a Dialog web component
 */
export default function createDialogElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-dialog',
		widgetConstructor: Dialog,
		attributes: [
			{
				attributeName: 'closeable',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'closetext',
				propertyName: 'closeText'
			},
			{
				attributeName: 'enteranimation',
				propertyName: 'enterAnimation'
			},
			{
				attributeName: 'exitanimation',
				propertyName: 'enterAnimation'
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
				eventName: 'close'
			}
		]
	};
};
