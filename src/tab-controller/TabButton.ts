import { DNode } from '@dojo/framework/core/interfaces';
import { I18nMixin, I18nProperties } from '@dojo/framework/core/mixins/I18n';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import { v } from '@dojo/framework/core/vdom';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import commonBundle from '../common/nls/common';
import { Keys } from '../common/util';

import * as css from '../theme/tab-controller.m.css';

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
 * @property onDownArrowPress   Called when the down arrow button is pressed
 * @property onEndPress         Called when the end button is pressed
 * @property onHomePress        Called when the home button is pressed
 * @property onLeftArrowPress   Called when the left arrow button is pressed
 * @property onRightArrowPress  Called when the right arrow button is pressed
 * @property onUpArrowPress     Called when the up arrow button is pressed
 */
export interface TabButtonProperties extends ThemedProperties, FocusProperties, I18nProperties {
	active?: boolean;
	closeable?: boolean;
	controls: string;
	disabled?: boolean;
	id: string;
	index: number;
	onClick?: (index: number) => void;
	onCloseClick?: (index: number) => void;
	onDownArrowPress?: () => void;
	onEndPress?: () => void;
	onHomePress?: () => void;
	onLeftArrowPress?: () => void;
	onRightArrowPress?: () => void;
	onUpArrowPress?: () => void;
}

export const ThemedBase = I18nMixin(ThemedMixin(FocusMixin(WidgetBase)));

@theme(css)
export class TabButtonBase<P extends TabButtonProperties = TabButtonProperties> extends ThemedBase<
	P
> {
	private _onClick(event: MouseEvent) {
		event.stopPropagation();
		const { disabled, index, onClick } = this.properties;

		!disabled && onClick && onClick(index);
	}

	private _onCloseClick(event: MouseEvent) {
		event.stopPropagation();
		const { index, onCloseClick } = this.properties;

		onCloseClick && onCloseClick(index);
	}

	private _onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();
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

	protected getContent(messages: typeof commonBundle.messages): DNode[] {
		const { active, closeable } = this.properties;

		return [
			...this.children,
			closeable
				? v(
						'button',
						{
							tabIndex: active ? 0 : -1,
							classes: this.theme(css.close),
							type: 'button',
							onclick: this._onCloseClick
						},
						[messages.close]
				  )
				: null,
			v('span', { classes: this.theme([css.indicator, active && css.indicatorActive]) }, [
				v('span', { classes: this.theme(css.indicatorContent) })
			])
		];
	}

	protected getModifierClasses(): (string | null)[] {
		const { active, closeable, disabled } = this.properties;
		return [
			active ? css.activeTabButton : null,
			closeable ? css.closeable : null,
			disabled ? css.disabledTabButton : null
		];
	}

	render(): DNode {
		const { active, controls, disabled, id } = this.properties;
		const { messages } = this.localizeBundle(commonBundle);

		return v(
			'div',
			{
				'aria-controls': controls,
				'aria-disabled': disabled ? 'true' : 'false',
				'aria-selected': active === true ? 'true' : 'false',
				classes: this.theme([css.tabButton, ...this.getModifierClasses()]),
				focus: this.shouldFocus,
				id,
				key: 'tab-button',
				onclick: this._onClick,
				onkeydown: this._onKeyDown,
				role: 'tab',
				tabIndex: active === true ? 0 : -1
			},
			[v('span', { classes: this.theme(css.tabButtonContent) }, this.getContent(messages))]
		);
	}
}

export default class TabButton extends TabButtonBase<TabButtonProperties> {}
