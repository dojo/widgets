import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import createSlidePanel from './createSlidePanel';

/**
 * Configures a SlidePanel web component
 *
 * @return	{CustomElementDescriptor?}
 */
export default function createSlidePanelElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-slide-panel',
		widgetFactory: createSlidePanel,
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
