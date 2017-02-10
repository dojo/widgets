import { DNode, Widget, WidgetProperties, WidgetFactory, TypedTargetEvent } from '@dojo/widget-core/interfaces';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';
import createFormLabelMixin, { FormLabelMixin, FormLabelMixinProperties } from '@dojo/widget-core/mixins/createFormLabelMixin';

export type TextInputProperties = WidgetProperties & FormLabelMixinProperties & {
	onInput?(event: TypedTargetEvent<HTMLInputElement>): void;
};

export type TextInput = Widget<TextInputProperties> & FormLabelMixin & {
	onInput(event: TypedTargetEvent<HTMLInputElement>): void;
};

export interface TextInputFactory extends WidgetFactory<TextInput, TextInputProperties> { }

const createTextInput: TextInputFactory = createWidgetBase
	.mixin(createFormLabelMixin)
	.mixin({
		mixin: {
			onInput(this: TextInput, event: TypedTargetEvent<HTMLInputElement>) {
				this.properties.onInput && this.properties.onInput(event);
			},
			render(this: TextInput): DNode {
				const {
					type = 'text'
				} = this.properties;

				return v('input', {
					type: type,
					oninput: this.onInput
				});
			}
		}
	});

export default createTextInput;
