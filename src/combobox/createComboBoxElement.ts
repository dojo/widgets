import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import ComboBox from './ComboBox';

/**
 * Configures a ComboBox web component
 *
 * @return	{CustomElementDescriptor?}
 */
export default function createComboBoxElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-combo-box',
		widgetFactory: ComboBox,
		attributes: [
			{
				attributeName: 'autoblur',
				propertyName: 'autoBlur',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'clearable',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'openonfocus',
				propertyName: 'openOnFocus',
				value: value => value === 'false' || value === '0' ? false : true
			},
			{
				attributeName: 'value'
			}
		],
		properties: [
			{
				propertyName: 'results'
			},
			{
				propertyName: 'inputProperties'
			},
			{
				propertyName: 'customResultItem'
			},
			{
				propertyName: 'customResultMenu'
			},
			{
				propertyName: 'getResultLabel'
			}
		],
		events: [
			{
				propertyName: 'onBlur',
				eventName: 'blur'
			},
			{
				propertyName: 'onFocus',
				eventName: 'focus'
			},
			{
				propertyName: 'onChange',
				eventName: 'change'
			},
			{
				propertyName: 'onRequestResults',
				eventName: 'requestresults'
			},
			{
				propertyName: 'onMenuChange',
				eventName: 'menuchange'
			}
		]
	};
};
