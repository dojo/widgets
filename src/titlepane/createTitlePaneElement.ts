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
				attributeName: 'headinglevel',
				value: (value) => Number(value)
			},
			{
				attributeName: 'closeable',
				value: (value) => (value === 'false' || value === '0' ? false : true)
			},
			{
				attributeName: 'open',
				value: (value) => (value === 'false' || value === '0' ? false : true)
			},
			{
				attributeName: 'title'
			}
		],
		properties: [{ propertyName: 'theme' }],
		events: [
			{
				propertyName: 'onRequestClose',
				eventName: 'close'
			},
			{
				propertyName: 'onRequestOpen',
				eventName: 'open'
			}
		]
	};
}
