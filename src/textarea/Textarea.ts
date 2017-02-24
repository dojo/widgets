import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { FormLabelMixin, FormLabelMixinProperties } from '@dojo/widget-core/mixins/FormLabel';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/textarea.css';

/**
 * @type TextareaProperties
 *
 * Properties that can be set on a TextInput component
 *
 * @property columns	Number of columns, controls the width of the textarea
 * @property rows			Number of rows, controls the height of the textarea
 * @property wrapText			Controls text wrapping. Can be "hard", "soft", or "off"
 * @property onBlur				Called when the input loses focus
 * @property onChange			Called when the node's 'change' event is fired
 * @property onClick			Called when the input is clicked
 * @property onFocus			Called when the input is focused
 * @property onInput			Called when the 'input' event is fired
 * @property onKeyDown		Called on the input's keydown event
 * @property onKeyPress		Called on the input's keypress event
 * @property onKeyUp			Called on the input's keyup event
 * @property onMouseDown	Called on the input's mousedown event
 * @property onMouseUp		Called on the input's mouseup event
 * @property onTouchStart	Called on the input's touchstart event
 * @property onTouchEnd		Called on the input's touchend event
 * @property onTouchCancel	Called on the input's touchcancel event
 */
export interface TextareaProperties extends ThemeableProperties, FormLabelMixinProperties {
	columns?: number;
	rows?: number;
	wrapText?: string;
	onBlur?(event: FocusEvent): void;
	onChange?(event: Event): void;
	onClick?(event: MouseEvent): void;
	onFocus?(event: FocusEvent): void;
	onInput?(event: Event): void;
	onKeyDown?(event: KeyboardEvent): void;
	onKeyPress?(event: KeyboardEvent): void;
	onKeyUp?(event: KeyboardEvent): void;
	onMouseDown?(event: MouseEvent): void;
	onMouseUp?(event: MouseEvent): void;
	onTouchStart?(event: TouchEvent): void;
	onTouchEnd?(event: TouchEvent): void;
	onTouchCancel?(event: TouchEvent): void;
}

@theme(css)
export default class Textarea extends ThemeableMixin(FormLabelMixin(WidgetBase))<TextareaProperties> {
	render() {
		const {
			columns = null,
			rows = null,
			wrapText = null,
			invalid,
			onBlur,
			onChange,
			onClick,
			onFocus,
			onInput,
			onKeyDown,
			onKeyPress,
			onKeyUp,
			onMouseDown,
			onMouseUp,
			onTouchStart,
			onTouchEnd,
			onTouchCancel
		} = this.properties;

		const classes = [
			css.root,
			typeof invalid === 'boolean' ? invalid ? css.invalid : css.valid : null
		];

		return v('textarea', {
			classes: this.classes(...classes).get(),
			cols: columns ? columns + '' : null,
			rows: rows ? rows + '' : null,
			wrap: wrapText,
			onblur: onBlur,
			onchange: onChange,
			onclick: onClick,
			onfocus: onFocus,
			oninput: onInput,
			onkeydown: onKeyDown,
			onkeypress: onKeyPress,
			onkeyup: onKeyUp,
			onmousedown: onMouseDown,
			onmouseup: onMouseUp,
			ontouchstart: onTouchStart,
			ontouchend: onTouchEnd,
			ontouchcancel: onTouchCancel
		});
	}
}
