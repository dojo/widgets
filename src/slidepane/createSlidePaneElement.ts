import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import SlidePane from './SlidePane';

/**
 * Configures a SlidePane web component
 */
export default function createSlidePaneElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-slide-pane',
		widgetConstructor: SlidePane,
		attributes: [
			{
				attributeName: 'align'
			},
			{
				attributeName: 'open',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'underlay',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'width',
				value: value => Number(value)
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
