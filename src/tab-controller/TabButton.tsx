import { DNode } from '@dojo/framework/core/interfaces';
import { I18nMixin, I18nProperties } from '@dojo/framework/core/mixins/I18n';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import { v } from '@dojo/framework/core/vdom';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import commonBundle from '../common/nls/common';
import { Keys } from '../common/util';

import * as css from '../theme/default/tab-controller.m.css';

export interface TabButtonProperties extends ThemedProperties, FocusProperties, I18nProperties {
	/** Determines whether this tab button is active */
	active?: boolean;
	/** Determines whether this tab can be closed */
	closeable?: boolean;
	/** ID of the DOM element this tab button controls */
	controls: string;
	/** Determines whether this tab can become active */
	disabled?: boolean;
	/** The id to apply to this widget top level for a11y */
	id: string;
	/** The position of this tab button */
	index: number;
	/** Called when this tab button is clicked */
	onClick?: (index: number) => void;
	/** Called when this tab button's close icon is clicked */
	onCloseClick?: (index: number) => void;
	/** Called when the down arrow button is pressed */
	onDownArrowPress?: () => void;
	/** Called when the end button is pressed */
	onEndPress?: () => void;
	/** Called when the home button is pressed */
	onHomePress?: () => void;
	/** Called when the left arrow button is pressed */
	onLeftArrowPress?: () => void;
	/** Called when the right arrow button is pressed */
	onRightArrowPress?: () => void;
	/** Called when the up arrow button is pressed */
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
