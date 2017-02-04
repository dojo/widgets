import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import createSlidePanel from './createSlidePanel';

export default function createSlidePanelElement(): CustomElementDescriptor {
	return {
		tagName: 'slide-panel',
		widgetFactory: createSlidePanel,
		attributes: [
			{
				attributeName: 'align'
			},
			{
				attributeName: 'open',
				value: value => Boolean(value)
			},
			{
				attributeName: 'underlay',
				value: value => Boolean(value)
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
