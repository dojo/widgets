import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import theme from '../middleware/theme';
import i18n from '@dojo/framework/core/middleware/i18n';
import bundle from './nls/SlidePane';
import * as fixedCss from './styles/slide-pane.m.css';
import * as css from '../theme/default/slide-pane.m.css';
import { uuid } from '@dojo/framework/core/util';
import { formatAriaProperties } from '../common/util';
import Icon from '../icon';
import * as animations from '../common/styles/animations.m.css';

/**
 * Enum for left / right alignment
 */
export type Align = 'bottom' | 'left' | 'right' | 'top';

export interface SlidePaneProperties {
	/** The position of the pane on the screen */
	align?: Align;
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Hidden text used by screen readers to display for the close button */
	closeText?: string;

	/** Called when the pane is swiped closed or the underlay is clicked or tapped */
	onRequestClose?(): void;

	/** Determines whether the pane is open or closed */
	open?: boolean;
	/** Title to display in the pane */
	title?: string;
	/** Determines whether a semi-transparent background shows behind the pane */
	underlay?: boolean;
	/** Width of the pane in pixels */
	width?: number;
}

/**
 * The default width of the slide pane
 */
const DEFAULT_WIDTH = 320;

enum Plane {
	x,
	y
}

enum Slide {
	in,
	out
}

export interface SlidePaneICache {
	initialPosition: number;
	slide: Slide | undefined;
	swiping: boolean | undefined;
	titleId: string;
	transform: number;
	hasMoved: boolean;
	open: boolean;
}

const factory = create({
	icache: createICacheMiddleware<SlidePaneICache>(),
	theme,
	i18n
}).properties<SlidePaneProperties>();

export const SlidePane = factory(function SlidePane({
	middleware: { icache, theme, i18n },
	properties,
	children
}) {
	let {
		aria = {},
		closeText,
		open = false,
		title = '',
		align = 'left',
		width = DEFAULT_WIDTH,
		underlay = false,
		theme: themeProp,
		variant,
		classes
	} = properties();
	const themeCss = theme.classes(css);

	if (icache.get('open') !== open) {
		const wasOpen = icache.get('open');
		icache.set('open', open);

		if (open && !wasOpen) {
			icache.set('slide', Slide.in);
		} else if (!open && wasOpen) {
			icache.set('slide', Slide.out);
		}
	}

	const plane = align === 'left' || align === 'right' ? Plane.x : Plane.y;

	let translate = '';
	const translateAxis = plane === Plane.x ? 'X' : 'Y';

	if (icache.get('swiping')) {
		translate =
			align === 'left' || align === 'top'
				? `-${icache.getOrSet('transform', 0)}`
				: `${icache.getOrSet('transform', 0)}`;
	}

	const contentStyles = {
		transform: translate ? `translate${translateAxis}(${translate}%)` : undefined,
		width: plane === Plane.x ? `${width}px` : undefined,
		height: plane === Plane.y ? `${width}px` : undefined
	};

	const alignCss: { [key: string]: any } = themeCss;
	const slide = icache.get('slide');

	const contentClasses = [
		alignCss[align],
		open ? themeCss.open : null,
		slide === Slide.in ? themeCss.slideIn : null,
		slide === Slide.out ? themeCss.slideOut : null
	];

	const fixedAlignCss: { [key: string]: any } = fixedCss;
	const fixedContentClasses = [fixedAlignCss[`${align}Fixed`]];

	if (!closeText) {
		const { messages } = i18n.localize(bundle);
		closeText = `${messages.close} ${title}`;
	}

	const getDelta = (event: PointerEvent, eventType: string) => {
		const { align = 'left' } = properties();
		const plane = align === 'left' || align === 'right' ? Plane.x : Plane.y;

		if (plane === Plane.x) {
			const currentX = event.pageX;
			return align === 'right'
				? currentX - icache.getOrSet('initialPosition', 0)
				: icache.getOrSet('initialPosition', 0) - currentX;
		} else {
			const currentY = event.pageY;
			return align === 'bottom'
				? currentY - icache.getOrSet('initialPosition', 0)
				: icache.getOrSet('initialPosition', 0) - currentY;
		}
	};

	const swipeStart = (event: PointerEvent) => {
		const { align = 'left' } = properties();

		const plane = align === 'left' || align === 'right' ? Plane.x : Plane.y;

		event.stopPropagation();
		icache.set('swiping', true);
		// Cache initial pointer position
		if (plane === Plane.x) {
			icache.set('initialPosition', event.pageX);
		} else {
			icache.set('initialPosition', event.pageY);
		}

		// Clear out the last transform applied
		icache.set('transform', 0);
	};

	const swipeMove = (event: PointerEvent) => {
		event.stopPropagation();
		// Ignore pointer movement when not swiping
		if (!icache.get('swiping')) {
			return;
		}

		event.preventDefault();
		icache.set('hasMoved', true);

		const { width = DEFAULT_WIDTH } = properties();

		const delta = getDelta(event, 'touchmove');

		// Prevent pane from sliding past screen edge
		if (delta >= 0) {
			icache.set('transform', (100 * delta) / width);
			icache.set('slide', undefined);
		}
	};

	const swipeEnd = (event: PointerEvent) => {
		event.stopPropagation();
		icache.set('swiping', false);
		icache.set('hasMoved', false);

		const { onRequestClose, width = DEFAULT_WIDTH } = properties();

		const delta = getDelta(event, 'touchend');

		// If the pane was swiped far enough to close
		if (delta > width / 2) {
			onRequestClose && onRequestClose();
		}
		// If pane was not swiped far enough to close
		else if (delta > 0) {
			// Animate the pane back open
			icache.set('slide', Slide.in);
		}
	};

	const onCloseClick = (event: MouseEvent) => {
		event.stopPropagation();
		const { onRequestClose } = properties();
		onRequestClose && onRequestClose();
	};

	const onUnderlayMouseUp = () => {
		const { onRequestClose } = properties();
		if (icache.getOrSet('hasMoved', false) === false) {
			onRequestClose && onRequestClose();
		}
	};

	const titleId = icache.getOrSet('titleId', uuid());

	return (
		<div
			aria-labelledby={titleId}
			classes={[theme.variant(), themeCss.root]}
			onpointerdown={swipeStart}
			onpointermove={swipeMove}
			onpointerup={swipeEnd}
			onpointercancel={swipeEnd}
		>
			{open ? (
				<div
					key="underlay"
					classes={[underlay ? themeCss.underlayVisible : null, fixedCss.underlay]}
					enterAnimation={animations.fadeIn}
					exitAnimation={animations.fadeOut}
					onpointerup={onUnderlayMouseUp}
				/>
			) : null}
			<div
				{...formatAriaProperties(aria)}
				key="content"
				classes={[
					themeCss.pane,
					...contentClasses,
					fixedCss.paneFixed,
					...fixedContentClasses
				]}
				styles={contentStyles}
			>
				{title ? (
					<div classes={themeCss.title} key="title">
						<div id={titleId} classes={themeCss.titleContent}>
							{title}
						</div>
						<button classes={themeCss.close} type="button" onclick={onCloseClick}>
							{closeText}
							<span classes={themeCss.closeIcon}>
								<Icon
									type="closeIcon"
									theme={themeProp}
									classes={classes}
									variant={variant}
								/>
							</span>
						</button>
					</div>
				) : null}
				<div classes={[themeCss.content, fixedCss.contentFixed]}>{children()}</div>
			</div>
		</div>
	);
});

export default SlidePane;
