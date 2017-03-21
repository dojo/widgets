import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import TitlePane from './TitlePane';

/**
 * Configures a TitlePane web component
 */
export default function createTitlePaneElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-title-pane',
		widgetConstructor: TitlePane,
		attributes: [
			{
				attributeName: 'headingLevel',
				value: value => Number(value)
			},
			{
				attributeName: 'closeable',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'open',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'title'
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
}
