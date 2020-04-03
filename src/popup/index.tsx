import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { theme } from '@dojo/framework/core/middleware/theme';
import { bodyScroll } from '../middleware/bodyScroll';
import { create, tsx } from '@dojo/framework/core/vdom';
import * as css from '../theme/default/popup.m.css';
import * as fixedCss from './popup.m.css';
import { RenderResult } from '@dojo/framework/core/interfaces';

export type PopupPosition = 'above' | 'below';

export interface BasePopupProperties {
	/** Preferred position where the popup should render relative to the provided position (defaults to "below"). If the popup does not have room to fully render in the preferred position it will switch to the opposite side. */
	position?: PopupPosition;
	/** If the underlay should be visible (defaults to false) */
	underlayVisible?: boolean;
	/** Callback triggered when the popup is closed */
	onClose?(): void;
}

export interface PopupProperties extends BasePopupProperties {
	/** The X position on the page where the popup should render */
	x: number;
	/** The Y position on the page where the bottom of the popup should be if rendering "above" */
	yBottom: number;
	/** The Y position on the page where the popup should start if rendering "below" */
	yTop: number;
	/** Whether the popup is currently open */
	open?: boolean;
}

const factory = create({ dimensions, theme, bodyScroll })
	.properties<PopupProperties>()
	.children<RenderResult | undefined>();

export const Popup = factory(function({
	properties,
	children,
	middleware: { dimensions, theme, bodyScroll }
}) {
	const {
		underlayVisible = false,
		position = 'below',
		x,
		yBottom,
		yTop,
		onClose,
		open
	} = properties();

	const wrapperDimensions = dimensions.get('wrapper');
	const bottomOfVisibleScreen =
		document.documentElement.scrollTop + document.documentElement.clientHeight;
	const topOfVisibleScreen = document.documentElement.scrollTop;

	const willFit = {
		below: yTop + wrapperDimensions.size.height <= bottomOfVisibleScreen,
		above: yBottom - wrapperDimensions.size.height >= topOfVisibleScreen
	};

	let wrapperStyles: Partial<CSSStyleDeclaration> = {
		opacity: '0'
	};

	if (wrapperDimensions.size.height) {
		wrapperStyles = {
			left: `${x}px`,
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
