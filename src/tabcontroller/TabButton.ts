import { DNode } from '@dojo/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { Keys } from '../common/util';

import * as css from './styles/tabController.m.css';

/**
 * @type TabButtonProperties
 *
 * Properties that can be set on a TabButton component
 *
 * @property active             Determines whether this tab button is active
 * @property callFocus          Used to immediately call focus on the cell
 * @property closeable          Determines whether this tab can be closed
 * @property controls           ID of the DOM element this tab button controls
 * @property disabled           Determines whether this tab can become active
 * @property id                 ID of this tab button DOM element
 * @property index              The position of this tab button
 * @property onClick            Called when this tab button is clicked
 * @property onCloseClick       Called when this tab button's close icon is clicked
 * @property onDownArrowPress   Called when the down arrow button is pressed
 * @property onEndPress         Called when the end button is pressed
 * @property onFocusCalled      Callback function when the cell receives focus
 * @property onHomePress        Called when the home button is pressed
 * @property onLeftArrowPress   Called when the left arrow button is pressed
 * @property onRightArrowPress  Called when the right arrow button is pressed
 * @property onUpArrowPress     Called when the up arrow button is pressed
 */
export interface TabButtonProperties extends ThemedProperties {
	active?: boolean;
	callFocus?: boolean;
	closeable?: boolean;
	controls: string;
	disabled?: boolean;
	id: string;
	index: number;
	onClick?: (index: number) => void;
	onCloseClick?: (index: number) => void;
	onDownArrowPress?: () => void;
	onEndPress?: () => void;
	onFocusCalled?: () => void;
	onHomePress?: () => void;
	onLeftArrowPress?: () => void;
	onRightArrowPress?: () => void;
	onUpArrowPress?: () => void;
};

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class TabButton<P extends TabButtonProperties = TabButtonProperties> extends ThemedBase<P> {
	private _onClick() {
		const {
			disabled,
			index,
			onClick
		} = this.properties;

		!disabled && onClick && onClick(index);
	}

	private _onCloseClick(event: MouseEvent) {
		const {
			index,
			onCloseClick
		} = this.properties;

		event.stopPropagation();
		onCloseClick && onCloseClick(index);
	}

	private _onKeyDown(event: KeyboardEvent) {
		const {
			closeable,
			disabled,
			index,
			onCloseClick,
			onDownArrowPress,
			onEndPress,
			onHomePress,
			onLeftArrowPress,
			onRightArrowPress,
			onUpArrowPress
		} = this.properties;

		if (disabled) {
			return;
		}

		// Accessibility
		switch (event.which) {
			// Escape
			case Keys.Escape:
				closeable && onCloseClick && onCloseClick(index);
				break;
			// Left arrow
			case Keys.Left:
				onLeftArrowPress && onLeftArrowPress();
				break;
			// Right arrow
			case Keys.Right:
				onRightArrowPress && onRightArrowPress();
				break;
			// Up arrow
			case Keys.Up:
				onUpArrowPress && onUpArrowPress();
				break;
			// Down arrow
			case Keys.Down:
				onDownArrowPress && onDownArrowPress();
				break;
			// Home
			case Keys.Home:
				onHomePress && onHomePress();
				break;
			// End
			case Keys.End:
				onEndPress && onEndPress();
				break;
		}
	}

	private _callFocus(element: HTMLElement) {
		const { callFocus, onFocusCalled } = this.properties;
		if (callFocus) {
			element.focus();
			onFocusCalled && onFocusCalled();
		}
	}

	protected getContent(): DNode[] {
		const { active, closeable } = this.properties;

		return [
			...this.children,
			closeable ? v('button', {
				tabIndex: active ? 0 : -1,
				classes: this.theme(css.close),
				innerHTML: 'close tab',
				onclick: this._onCloseClick
			}) : null
		];
	}

	protected getModifierClasses(): (string | null)[] {
		const { active, disabled } = this.properties;
		return [
			active ? css.activeTabButton : null,
			disabled ? css.disabledTabButton : null
		];
	}

	protected onElementCreated(element: HTMLElement, key: string) {
		key === 'tab-button' && this._callFocus(element);
	}

	protected onElementUpdated(element: HTMLElement, key: string) {
		key === 'tab-button' && this._callFocus(element);
	}

	render(): DNode {
		const {
			active,
			controls,
			disabled,
			id
		} = this.properties;

		return v('div', {
			'aria-controls': controls,
			'aria-disabled': disabled ? 'true' : 'false',
			'aria-selected': active === true ? 'true' : 'false',
			classes: this.theme([ css.tabButton, ...this.getModifierClasses() ]),
			id,
			key: 'tab-button',
			onclick: this._onClick,
			onkeydown: this._onKeyDown,
			role: 'tab',
			tabIndex: active === true ? 0 : -1
		}, this.getContent());
	}
}
