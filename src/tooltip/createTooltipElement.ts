import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import Tooltip from './Tooltip';

/**
 * Configures a Tooltip web component
 */
export default function createTooltipElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-tooltip',
		widgetConstructor: Tooltip,
		attributes: [
			{
				attributeName: 'open',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'orientation'
			}
		],
		properties: [
			{
				propertyName: 'content'
			}
		]
	};
};
