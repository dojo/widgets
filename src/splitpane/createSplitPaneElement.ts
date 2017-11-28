import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import SplitPane from './SplitPane';

/**
 * Configures a SplitPane web component
 */
export default function createSplitPaneElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-split-pane',
		widgetConstructor: SplitPane,
		attributes: [
			{
				attributeName: 'direction'
			},
			{
				attributeName: 'size'
			}
		],
		properties: [
			{ propertyName: 'leading' },
			{ propertyName: 'trailing' },
			{ propertyName: 'theme' }
		],
		events: [
			{
				propertyName: 'onResize',
				eventName: 'resize'
			}
		]
	};
};
