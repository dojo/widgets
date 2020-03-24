import focus from '@dojo/framework/core/middleware/focus';
import i18n from '@dojo/framework/core/middleware/i18n';
import theme from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';

import commonBundle from '../common/nls/common';
import { Keys } from '../common/util';
import * as css from '../theme/default/tab-controller.m.css';

export interface TabButtonProperties {
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

const factory = create({ focus, i18n, theme }).properties<TabButtonProperties>();

export const TabButton = factory(function TabButton({
	children,
	middleware: { focus, i18n, theme },
	properties
}) {
	const { active, closeable, controls, disabled, id } = properties();
	const { messages } = i18n.localize(commonBundle);
	const themeCss = theme.classes(css);

	const onClick = (event: MouseEvent) => {
		event.stopPropagation();
		const { disabled, index, onClick } = properties();

		!disabled && onClick && onClick(index);
	};

	const onCloseClick = (event: MouseEvent) => {
		event.stopPropagation();
		const { index, onCloseClick } = properties();

		onCloseClick && onCloseClick(index);
	};

	const onKeyDown = (event: KeyboardEvent) => {
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
		} = properties();

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
	};

	return (
		<div
			aria-controls={controls}
			aria-disabled={disabled ? 'true' : 'false'}
			aria-selected={active === true ? 'true' : 'false'}
			classes={[
				themeCss.tabButton,
				active ? themeCss.activeTabButton : null,
				closeable ? themeCss.closeable : null,
				disabled ? themeCss.disabledTabButton : null
			]}
			focus={focus.shouldFocus}
			id={id}
			key="tab-button"
			onclick={onClick}
			onkeydown={onKeyDown}
			role="tab"
			tabIndex={active === true ? 0 : -1}
		>
			<span classes={themeCss.tabButtonContent}>
				{children()}
				{closeable ? (
					<button
						tabIndex={active ? 0 : -1}
						classes={themeCss.close}
						type="button"
						onclick={onCloseClick}
					>
						{messages.close}
					</button>
				) : null}
				<span classes={[themeCss.indicator, active && themeCss.indicatorActive]}>
					<span classes={themeCss.indicatorContent} />
				</span>
			</span>
		</div>
	);
});

export default TabButton;
