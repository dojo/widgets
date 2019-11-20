import { DimensionResults } from '@dojo/framework/core/meta/Dimensions';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { theme } from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';
import * as css from '../theme/popup.m.css';
import * as fixedCss from './popup.m.css';

export type PopupPosition = 'above' | 'below';

export interface PopupProperties {
	/** The dimensions of the anchor that triggers this popup */
	triggerDimensions: DimensionResults;
	/** Property to define if the popup wrapper should match the trigger width, defaults to true */
	matchWidth?: boolean;
	/** Callback called when the popup wishes to close */
	onClose(): void;
	/** Property to define where the popup should render relative to the trigger, defaults to below */
	position?: PopupPosition;
	/** Property to define if the underlay should be visible, defaults to false */
	underlayVisible?: boolean;
}

const factory = create({ dimensions, theme }).properties<PopupProperties>();

export const Popup = factory(function({ properties, children, middleware: { dimensions, theme } }) {
	const {
		onClose,
		underlayVisible = false,
		triggerDimensions: { size: aSize, position: aPosition },
		position = 'below',
		matchWidth = true
	} = properties();

	const wrapperDimensions = dimensions.get('wrapper');
	const triggerTop = aPosition.top + document.documentElement.scrollTop;
	const triggerBottom = triggerTop + aSize.height;
	const bottomOfVisibleScreen =
		document.documentElement.scrollTop + document.documentElement.clientHeight;
	const topOfVisibleScreen = document.documentElement.scrollTop;

	const willFit = {
		below: triggerBottom + wrapperDimensions.size.height <= bottomOfVisibleScreen,
		above: triggerTop - wrapperDimensions.size.height >= topOfVisibleScreen
	};

	let wrapperStyles: Partial<CSSStyleDeclaration> = {
		opacity: '0'
	};

	if (wrapperDimensions.size.height) {
		wrapperStyles = {
			width: matchWidth ? `${aSize.width}px` : 'auto',
			left: `${aPosition.left}px`,
			opacity: '1'
		};

		if (position === 'below') {
			if (willFit.below) {
				wrapperStyles.top = `${triggerBottom}px`;
			} else {
				wrapperStyles.top = `${triggerTop - wrapperDimensions.size.height}px`;
			}
		} else if (position === 'above') {
			if (willFit.above) {
				wrapperStyles.top = `${triggerTop - wrapperDimensions.size.height}px`;
			} else {
				wrapperStyles.top = `${triggerBottom}px`;
			}
		}
	}

	const classes = theme.classes(css);

	return (
		<body>
			<div
				key="underlay"
				classes={[fixedCss.underlay, underlayVisible && classes.underlayVisible]}
				onclick={onClose}
			/>
			<div key="wrapper" classes={fixedCss.root} styles={wrapperStyles}>
				{children()}
			</div>
		</body>
	);
});

export default Popup;
