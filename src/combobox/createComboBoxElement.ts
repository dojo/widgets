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

		],
		events: [

		]
	};
};
