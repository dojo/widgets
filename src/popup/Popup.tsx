import { create, tsx } from '@dojo/framework/core/vdom';
import * as css from '../theme/popup.m.css';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { theme } from '@dojo/framework/core/middleware/theme';
import { DimensionResults } from '@dojo/framework/core/meta/Dimensions';

export type PopupPosition = 'above' | 'below';

export interface PopupProperties {
	onClose(): void;
	underlayVisible?: boolean;
	anchorDimensions: DimensionResults;
	position?: PopupPosition;
}

const factory = create({ dimensions, theme }).properties<PopupProperties>();

export const Popup = factory(function({ properties, children, middleware: { dimensions, theme } }) {
	const {
		onClose,
		underlayVisible = false,
		anchorDimensions: { size: aSize, position: aPosition },
		position = 'below'
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
			width: `${aSize.width}px`,
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
				classes={[classes.underlay, underlayVisible && classes.underlayVisible]}
				onclick={onClose}
			/>
			<div key="wrapper" classes={classes.root} styles={wrapperStyles}>
				{children()}
			</div>
		</body>
	);
});

export default Popup;
