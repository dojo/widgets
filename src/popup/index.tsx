import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { resize } from '@dojo/framework/core/middleware/resize';
import { theme } from '@dojo/framework/core/middleware/theme';
import { bodyScroll } from '../middleware/bodyScroll';
import { create, tsx } from '@dojo/framework/core/vdom';
import * as css from '../theme/default/popup.m.css';
import * as fixedCss from './popup.m.css';
import { RenderResult } from '@dojo/framework/core/interfaces';

export type PopupPosition = 'above' | 'below' | 'left' | 'right';

export interface BasePopupProperties {
	/** Preferred position where the popup should render relative to the provided position (defaults to "below"). If the popup does not have room to fully render in the preferred position it will switch to the opposite side. */
	position?: PopupPosition;
	/** If the underlay should be visible (defaults to false) */
	underlayVisible?: boolean;
	/** Callback triggered when the popup is closed */
	onClose?(): void;
}

export interface PopupProperties extends BasePopupProperties {
	/** The Y position on the page where the bottom of the popup should be if rendering "above" */
	yBottom: number;
	/** The Y position on the page where the popup should start if rendering "below" */
	yTop: number;
	/** The right boundary of the popup position */
	xRight: number;
	/** The left boundary for the popup position */
	xLeft: number;
	/** Whether the popup is currently open */
	open?: boolean;
}

const factory = create({ dimensions, theme, bodyScroll, resize })
	.properties<PopupProperties>()
	.children<RenderResult | undefined>();

export const Popup = factory(function({
	properties,
	children,
	middleware: { dimensions, theme, bodyScroll, resize }
}) {
	const {
		underlayVisible = false,
		position = 'below',
		yBottom,
		yTop,
		xRight,
		xLeft,
		onClose,
		open
	} = properties();

	resize.get('wrapper');
	const wrapperDimensions = dimensions.get('wrapper');
	const bottomOfVisibleScreen =
		document.documentElement.scrollTop + document.documentElement.clientHeight;
	const topOfVisibleScreen = document.documentElement.scrollTop;
	const widthOfScreen = document.documentElement.clientWidth;

	const willFit = {
		below: yTop + wrapperDimensions.size.height <= bottomOfVisibleScreen,
		above: yBottom - wrapperDimensions.size.height >= topOfVisibleScreen,
		left: xLeft - wrapperDimensions.size.width >= 0,
		right: xRight + wrapperDimensions.size.width <= widthOfScreen
	};

	let wrapperStyles: Partial<CSSStyleDeclaration> = {
		opacity: '0'
	};

	if (wrapperDimensions.size.height) {
		wrapperStyles = {
			left: `${xLeft}px`,
			opacity: '1'
		};

		if (position === 'below') {
			if (willFit.below) {
				wrapperStyles.top = `${yTop}px`;
			} else {
				wrapperStyles.top = `${yBottom - wrapperDimensions.size.height}px`;
			}
		} else if (position === 'above') {
			if (willFit.above) {
				wrapperStyles.top = `${yBottom - wrapperDimensions.size.height}px`;
			} else {
				wrapperStyles.top = `${yTop}px`;
			}
		}

		if (position === 'left' || position === 'right') {
			const triggerHeight = yTop - yBottom;
			wrapperStyles.top = `${Math.max(
				yBottom + triggerHeight / 2 - wrapperDimensions.size.height / 2,
				topOfVisibleScreen
			)}px`;
		}

		if (position === 'left') {
			if (willFit.left) {
				wrapperStyles.left = `${xLeft - wrapperDimensions.size.width}px`;
			} else {
				wrapperStyles.left = `${xRight}px`;
			}
		} else if (position === 'right') {
			if (willFit.right) {
				wrapperStyles.left = `${xRight}px`;
			} else {
				wrapperStyles.left = `${xLeft - wrapperDimensions.size.width}px`;
			}
		}
	}

	const classes = theme.classes(css);

	bodyScroll(!open);

	return (
		open && (
			<body>
				<div
					key="underlay"
					classes={[
						theme.variant(),
						fixedCss.underlay,
						underlayVisible && classes.underlayVisible
					]}
					onclick={onClose}
				/>
				<div
					key="wrapper"
					classes={[theme.variant(), fixedCss.root]}
					styles={wrapperStyles}
				>
					{children()}
				</div>
			</body>
		)
	);
});

export default Popup;
