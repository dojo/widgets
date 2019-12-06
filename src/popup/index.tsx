import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { theme } from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';
import * as css from '../theme/default/popup.m.css';
import * as fixedCss from './popup.m.css';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';

export type PopupPosition = 'above' | 'below';

export interface PopupProperties {
	/** If the popup wrapper should match the trigger width (defaults to true) */
	matchWidth?: boolean;
	/** Where the popup should render relative to the trigger (defaults to "below") */
	position?: PopupPosition;
	/** If the underlay should be visible (defaults to false) */
	underlayVisible?: boolean;
	/** Callback triggered when the popup is opened */
	onOpen?(): void;
	/** Callback triggered when the popup is closed */
	onClose?(): void;
}

interface PopupICache {
	open: boolean;
}

export interface PopupChildren {
	trigger: (toggleOpen: () => void) => RenderResult;
	content: (close: () => void) => RenderResult;
}

const icache = createICacheMiddleware<PopupICache>();

const factory = create({ dimensions, theme, icache })
	.properties<PopupProperties>()
	.children<PopupChildren>();

export const Popup = factory(function({
	properties,
	children,
	middleware: { dimensions, theme, icache }
}) {
	const {
		underlayVisible = false,
		position = 'below',
		matchWidth = true,
		onClose,
		onOpen
	} = properties();

	const wrapperDimensions = dimensions.get('wrapper');
	const { position: triggerPosition, size: triggerSize } = dimensions.get('trigger');
	const triggerTop = triggerPosition.top + document.documentElement.scrollTop;
	const triggerBottom = triggerTop + triggerSize.height;
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
			width: matchWidth ? `${triggerSize.width}px` : 'auto',
			left: `${triggerPosition.left}px`,
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
	const { trigger, content } = children()[0];
	const open = icache.getOrSet('open', false);

	function toggleOpen() {
		const open = icache.get('open');
		icache.set('open', !open);
		if (open) {
			onClose && onClose();
		} else {
			onOpen && onOpen();
		}
	}

	function close() {
		icache.set('open', false);
		onClose && onClose();
	}

	return (
		<virtual>
			<span key="trigger" classes={fixedCss.trigger}>
				{trigger(toggleOpen)}
			</span>
			{open && (
				<body>
					<div
						key="underlay"
						classes={[fixedCss.underlay, underlayVisible && classes.underlayVisible]}
						onclick={close}
					/>
					<div key="wrapper" classes={fixedCss.root} styles={wrapperStyles}>
						{content(close)}
					</div>
				</body>
			)}
		</virtual>
	);
});

export default Popup;
