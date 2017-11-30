import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import Progress from './Progress';

/**
 * Configures a Progress web component
 */
export default function createProgressElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-progress',
		widgetConstructor: Progress,
		attributes: [
			{
				attributeName: 'value',
				value: value => Number(value)
			},
			{
				attributeName: 'max',
				value: value => Number(value)
			},
			{
				attributeName: 'min',
				value: value => Number(value)
			},
			{
				attributeName: 'min',
				value: value => Number(value)
			},
			{
				attributeName: 'showOutput',
				value: value => value === 'false' || value === '0' ? false : true
			}
		],
		properties: [
			{ propertyName: 'theme' }
		]
	};
};
