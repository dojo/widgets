import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import TabPane from './TabPane';

/**
 * Configures a TabPane web component
 */
export default function createTabPaneElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-tab-pane',
		widgetConstructor: TabPane,
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
		events: [
			{
				propertyName: 'onTabChange',
				eventName: 'tabchange'
			},
			{
				propertyName: 'onTabClose',
				eventName: 'tabclose'
			}
		]
	};
};
