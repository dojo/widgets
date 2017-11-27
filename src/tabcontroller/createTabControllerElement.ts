import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import TabController from './TabController';

/**
 * Configures a TabController web component
 */
export default function createTabControllerElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-tab-pane',
		widgetConstructor: TabController,
		attributes: [
			{
				attributeName: 'activeindex',
				propertyName: 'activeIndex',
				value: value => Number(value)
			},
			{
				attributeName: 'alignbuttons',
				propertyName: 'alignButtons',
				value: value => Number(value)
			}
		],
		properties: [
			{ propertyName: 'theme' }
		],
		events: [
			{
				propertyName: 'onRequestTabChange',
				eventName: 'tabchange'
			},
			{
				propertyName: 'onRequestTabClose',
				eventName: 'tabclose'
			}
		]
	};
};
