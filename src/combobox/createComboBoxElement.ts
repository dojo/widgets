import { CustomElementDescriptor } from '@dojo/widget-core/customElements';
import ComboBox from './ComboBox';

/**
 * Configures a ComboBox web component
 */
export default function createComboBoxElement(): CustomElementDescriptor {
	return {
		tagName: 'dojo-combo-box',
		widgetConstructor: ComboBox,
		attributes: [
			{
				attributeName: 'autoblur',
				propertyName: 'autoBlur',
				value: (value) => (value === 'false' || value === '0' ? false : true)
			},
			{
				attributeName: 'clearable',
				value: (value) => (value === 'false' || value === '0' ? false : true)
			},
			{
				attributeName: 'invalid',
				value: (value) => (value === 'false' || value === '0' ? false : true)
			},
			{
				attributeName: 'disabled',
				value: (value) => (value === 'false' || value === '0' ? false : true)
			},
			{
				attributeName: 'openonfocus',
				propertyName: 'openOnFocus',
				value: (value) => (value === 'false' || value === '0' ? false : true)
			},
			{
				attributeName: 'readonly',
				propertyName: 'readOnly',
				value: (value) => (value === 'false' || value === '0' ? false : true)
			},
			{
				attributeName: 'required',
				value: (value) => (value === 'false' || value === '0' ? false : true)
			},
			{
				attributeName: 'value'
			}
		],
		properties: [
			{ propertyName: 'results' },
			{ propertyName: 'inputProperties' },
			{ propertyName: 'CustomResultItem' },
			{ propertyName: 'CustomResultMenu' },
			{ propertyName: 'getResultLabel' },
			{ propertyName: 'isResultDisabled' },
			{ propertyName: 'label' },
			{ propertyName: 'theme' }
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
}
