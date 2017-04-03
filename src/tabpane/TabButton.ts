import { DNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

import * as css from './styles/tabPane.m.css';

/**
 * @type TabButtonProperties
 *
 * Properties that can be set on a TabButton component
 *
 * @property active             Determines whether this tab button is active
 * @property closeable          Determines whether this tab can be closed
 * @property controls           ID of the DOM element this tab button controls
 * @property disabled           Determines whether this tab can become active
 * @property id                 ID of this tab button DOM element
 * @property index              The position of this tab button
 * @property onClick            Called when this tab button is clicked
 * @property onCloseClick       Called when this tab button's close icon is clicked
 * @property onEndPress         Called when the end button is pressed
 * @property onHomePress        Called when the home button is pressed
 * @property onDownArrowPress   Called when the down arrow button is pressed
 * @property onLeftArrowPress   Called when the left arrow button is pressed
 * @property onRightArrowPress  Called when the right arrow button is pressed
 * @property onUpArrowPress     Called when the up arrow button is pressed
 */
export interface TabButtonProperties extends ThemeableProperties {
	active?: boolean;
	closeable?: boolean;
	controls: string;
	disabled?: boolean;
	id: string;
	index: number;
	onClick?: (index: number) => void;
	onCloseClick?: (index: number) => void;
	onEndPress?: () => void;
	onHomePress?: () => void;
	onDownArrowPress?: () => void;
	onLeftArrowPress?: () => void;
	onRightArrowPress?: () => void;
	onUpArrowPress?: () => void;
};

export const TabButtonBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class TabButton extends TabButtonBase<TabButtonProperties> {
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
			onEndPress,
			onHomePress,
			onDownArrowPress,
			onLeftArrowPress,
			onRightArrowPress,
			onUpArrowPress
		} = this.properties;

		if (disabled) {
			return;
		}

		// Accessibility
		switch (event.keyCode) {
			// Escape
			case 27:
				closeable && onCloseClick && onCloseClick(index);
				break;
			// Left arrow
			case 37:
				onLeftArrowPress && onLeftArrowPress();
				break;
			// Right arrow
			case 39:
				onRightArrowPress && onRightArrowPress();
				break;
			// Up arrow
			case 38:
				onUpArrowPress && onUpArrowPress();
				break;
			// Down arrow
			case 40:
				onDownArrowPress && onDownArrowPress();
				break;
			// Home
			case 36:
				onHomePress && onHomePress();
				break;
			// End
			case 35:
				onEndPress && onEndPress();
				break;
		}
	}

	private _restoreFocus(element: HTMLElement) {
		this.properties.active && element.focus();
	}

	protected onElementCreated(element: HTMLElement, key: string) {
		key === 'tab-button' && this._restoreFocus(element);
	}

	protected onElementUpdated(element: HTMLElement, key: string) {
		key === 'tab-button' && this._restoreFocus(element);
	}

	render(): DNode {
		const {
			active,
			closeable,
			controls,
			disabled,
			id
		} = this.properties;

		const children = closeable ? this.children.concat([
			v('button', {
				tabIndex: active ? 0 : -1,
				classes: this.classes(css.close),
				innerHTML: 'close tab',
				onclick: this._onCloseClick
			})
		]) : this.children;

		return v('div', {
			'aria-controls': controls,
			'aria-disabled': disabled ? 'true' : 'false',
			'aria-selected': active ? 'true' : 'false',
			classes: this.classes(
				css.tabButton,
				active ? css.activeTabButton : null,
				disabled ? css.disabledTabButton : null
			),
			id,
			key: 'tab-button',
			role: 'tab',
			tabIndex: active ? 0 : -1,
			onclick: this._onClick,
			onkeydown: this._onKeyDown
		}, children);
	}
}
