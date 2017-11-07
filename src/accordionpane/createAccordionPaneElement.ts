import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import AccordionPane from './AccordionPane';

/**
 * Configures a AccordionPane web component
 */
export default function createAccordionPaneElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-accordionpane',
		widgetConstructor: AccordionPane,
		properties: [
			{
				propertyName: 'openKeys'
			}
		],
		events: [
			{
				propertyName: 'onRequestClose',
				eventName: 'requestClose'
			},
			{
				propertyName: 'onRequestOpen',
				eventName: 'requestOpen'
			}
		]
	};
};
