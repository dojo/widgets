import { uuid } from '@dojo/framework/core/util';
import { DNode } from '@dojo/framework/core/interfaces';
import { I18nMixin, I18nProperties } from '@dojo/framework/core/mixins/I18n';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v, w } from '@dojo/framework/core/vdom';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { formatAriaProperties } from '../common/util';
import * as animations from '../common/styles/animations.m.css';
import commonBundle from '../common/nls/common';
import Icon from '../icon/index';
import * as fixedCss from './styles/slide-pane.m.css';
import * as css from '../theme/default/slide-pane.m.css';
import diffProperty from '@dojo/framework/core/decorators/diffProperty';

/**
 * Enum for left / right alignment
 */
export enum Align {
	bottom = 'bottom',
	left = 'left',
	right = 'right',
	top = 'top'
}

export interface SlidePaneProperties extends ThemedProperties, I18nProperties {
	/** The position of the pane on the screen */
	align?: Align;
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Hidden text used by screen readers to display for the close button */
	closeText?: string;
	/** Called when the pane opens */
	onOpen?(): void;
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

@theme(css)
export class SlidePane extends I18nMixin(ThemedMixin(WidgetBase))<SlidePaneProperties> {
	private _initialPosition = 0;
	private _slide: Slide | undefined;
	private _swiping: boolean | undefined;
	private _titleId = uuid();
	private _transform = 0;
	private _hasMoved = false;

	private get plane() {
		const { align = Align.left } = this.properties;
		return align === Align.left || align === Align.right ? Plane.x : Plane.y;
	}

	@diffProperty('open')
	protected _onOpenChange(
		oldProperties: Partial<SlidePaneProperties>,
		newProperties: Partial<SlidePaneProperties>
	) {
		const wasOpen = oldProperties.open;
		const { open, onOpen } = newProperties;

		if (open && !wasOpen) {
			this._slide = Slide.in;
			onOpen && onOpen();
		} else if (!open && wasOpen) {
			this._slide = Slide.out;
		}
	}

	private _getDelta(event: MouseEvent & TouchEvent, eventType: string) {
		const { align = Align.left } = this.properties;

		if (this.plane === Plane.x) {
			const currentX =
				event.type === eventType ? event.changedTouches[0].screenX : event.pageX;
			return align === Align.right
				? currentX - this._initialPosition
				: this._initialPosition - currentX;
		} else {
			const currentY =
				event.type === eventType ? event.changedTouches[0].screenY : event.pageY;
			return align === Align.bottom
				? currentY - this._initialPosition
				: this._initialPosition - currentY;
		}
	}

	private _onCloseClick(event: MouseEvent) {
		event.stopPropagation();
		const { onRequestClose } = this.properties;
		onRequestClose && onRequestClose();
	}

	private _onSwipeStart(event: MouseEvent & TouchEvent) {
		event.stopPropagation();
		this._swiping = true;
		// Cache initial pointer position
		if (this.plane === Plane.x) {
			this._initialPosition =
				event.type === 'touchstart' ? event.changedTouches[0].screenX : event.pageX;
		} else {
			this._initialPosition =
				event.type === 'touchstart' ? event.changedTouches[0].screenY : event.pageY;
		}

		// Clear out the last transform applied
		this._transform = 0;
	}

	private _onSwipeMove(event: MouseEvent & TouchEvent) {
		event.stopPropagation();
		// Ignore mouse movement when not swiping
		if (!this._swiping) {
			return;
		}
		this._hasMoved = true;

		const { width = DEFAULT_WIDTH } = this.properties;

		const delta = this._getDelta(event, 'touchmove');

		// Prevent pane from sliding past screen edge
		if (delta >= 0) {
			this._transform = (100 * delta) / width;
			this.invalidate();
		}
	}

	private _onSwipeEnd(event: MouseEvent & TouchEvent) {
		event.stopPropagation();
		this._swiping = false;
		this._hasMoved = false;

		const { onRequestClose, width = DEFAULT_WIDTH } = this.properties;

		const delta = this._getDelta(event, 'touchend');

		// If the pane was swiped far enough to close
		if (delta > width / 2) {
			onRequestClose && onRequestClose();
		}
		// If pane was not swiped far enough to close
		else if (delta > 0) {
			// Animate the pane back open
			this._slide = Slide.in;
			this.invalidate();
		}
	}

	private _onUnderlayMouseUp(event: MouseEvent & TouchEvent) {
		const { onRequestClose } = this.properties;
		if (this._hasMoved === false) {
			onRequestClose && onRequestClose();
		}
	}

	protected getContent(): DNode {
		return v(
			'div',
			{ classes: [this.theme(css.content), fixedCss.contentFixed] },
			this.children
		);
	}

	protected getStyles(): { [index: string]: string | undefined } {
		const { align = Align.left, width = DEFAULT_WIDTH } = this.properties;

		let translate = '';
		const translateAxis = this.plane === Plane.x ? 'X' : 'Y';

		if (this._swiping) {
			translate =
				align === Align.left || align === Align.top
					? `-${this._transform}`
					: `${this._transform}`;
		}

		return {
			transform: translate ? `translate${translateAxis}(${translate}%)` : undefined,
			width: this.plane === Plane.x ? `${width}px` : undefined,
			height: this.plane === Plane.y ? `${width}px` : undefined
		};
	}

	protected getFixedModifierClasses(): (string | null)[] {
		const { align = Align.left, open = false } = this.properties;
		const alignCss: { [key: string]: any } = fixedCss;

		return [
			open ? fixedCss.openFixed : null,
			alignCss[`${align}Fixed`],
			this._slide === Slide.in ? fixedCss.slideInFixed : null,
			this._slide === Slide.out ? fixedCss.slideOutFixed : null
		];
	}

	protected getModifierClasses(): (string | null)[] {
		const { align = Align.left, open = false } = this.properties;
		const alignCss: { [key: string]: any } = css;

		return [
			alignCss[align],
			open ? css.open : null,
			this._slide === Slide.in ? css.slideIn : null,
			this._slide === Slide.out ? css.slideOut : null
		];
	}

	protected renderTitle(): DNode {
		const { title = '' } = this.properties;
		return v('div', { id: this._titleId }, [title]);
	}

	protected renderUnderlay(): DNode {
		const { underlay = false } = this.properties;
		return v('div', {
			classes: [this.theme(underlay ? css.underlayVisible : null), fixedCss.underlay],
			enterAnimation: animations.fadeIn,
			exitAnimation: animations.fadeOut,
			onmouseup: this._onUnderlayMouseUp,
			ontouchend: this._onUnderlayMouseUp,
			key: 'underlay'
		});
	}

	protected render(): DNode {
		let { aria = {}, closeText, open = false, title = '', theme, classes } = this.properties;

		const contentStyles = this.getStyles();
		const contentClasses = this.getModifierClasses();
		const fixedContentClasses = this.getFixedModifierClasses();

		if (!closeText) {
			const { messages } = this.localizeBundle(commonBundle);
			closeText = `${messages.close} ${title}`;
		}

		// This is a side-effect of rendering, it clears the slide styles for the next render.
		this._slide = undefined;

		return v(
			'div',
			{
				'aria-labelledby': this._titleId,
				classes: [this.variant(), this.theme(css.root)],
				onmousedown: this._onSwipeStart,
				onmousemove: this._onSwipeMove,
				onmouseup: this._onSwipeEnd,
				ontouchend: this._onSwipeEnd,
				ontouchmove: this._onSwipeMove,
				ontouchstart: this._onSwipeStart
			},
			[
				open ? this.renderUnderlay() : null,
				v(
					'div',
					{
						...formatAriaProperties(aria),
						key: 'content',
						classes: [
							...this.theme([css.pane, ...contentClasses]),
							fixedCss.paneFixed,
							...fixedContentClasses
						],
						transitionend: this.invalidate,
						styles: contentStyles
					},
					[
						title
							? v(
									'div',
									{
										classes: this.theme(css.title),
										key: 'title'
									},
									[
										this.renderTitle(),
										v(
											'button',
											{
												classes: this.theme(css.close),
												type: 'button',
												onclick: this._onCloseClick
											},
											[
												closeText,
												v('span', { classes: this.theme(css.closeIcon) }, [
													w(Icon, {
														type: 'closeIcon',
														theme,
														classes
													})
												])
											]
										)
									]
							  )
							: null,
						this.getContent()
					]
				)
			]
		);
	}
}

export default SlidePane;
