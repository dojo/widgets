import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { theme } from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';
import * as css from '../theme/default/popup.m.css';
import * as fixedCss from './popup.m.css';
import { RenderResult } from '@dojo/framework/core/interfaces';

export type PopupPosition = 'above' | 'below';

export interface PopupProperties {
	/** Where the popup should render relative to the provided position (defaults to "below") */
	position?: PopupPosition;
	/** If the underlay should be visible (defaults to false) */
	underlayVisible?: boolean;
	/** The X position on the page where the popup should render */
	x: number;
	/** The Y position on the page where the bottom of the popup should be if rendering "above" */
	yBottom: number;
	/** The Y position on the page where the popup should start if rendering "below" */
	yTop: number;
	/** Callback triggered when the popup is closed */
	onClose(): void;
	/** Whether the popup is currently open */
	open?: boolean;
}

export interface PopupChildren {
	content: () => RenderResult;
}

const factory = create({ dimensions, theme })
	.properties<PopupProperties>()
	.children<PopupChildren>();

export const Popup = factory(function({ properties, children, middleware: { dimensions, theme } }) {
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
	const { content } = children()[0];

	return (
		open && (
			<body>
				<div
					key="underlay"
					classes={[fixedCss.underlay, underlayVisible && classes.underlayVisible]}
					onclick={onClose}
				/>
				<div key="wrapper" classes={fixedCss.root} styles={wrapperStyles}>
					{content()}
				</div>
			</body>
		)
	);
});

export default Popup;
