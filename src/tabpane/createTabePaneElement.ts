import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import TabPane from './TabPane';

/**
 * Configures a TabPane web component
 *
 * @return	{CustomElementDescriptor?}
 */
export default function createTabPaneElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-tab-pane',
		widgetFactory: TabPane,
		attributes: [
			{
				attributeName: 'activeindex',
				propertyName: 'activeIndex',
				value: value => Number(value)
			},
			{
				attributeName: 'alignButtons'
			},
			{
				attributeName: 'loadingindex',
				propertyName: 'loadingIndex',
				value: value => Number(value)
			}
		],
		properties: [
			{
				propertyName: 'tabs'
			}
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
