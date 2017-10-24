import uuid from '@dojo/core/uuid';
import { DNode, AnimationTimingProperties } from '@dojo/widget-core/interfaces';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import AnimatableMixin from '@dojo/widget-core/mixins/Animatable';
import Dimensions from '@dojo/widget-core/meta/Dimensions';
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

import { Keys } from '../common/util';

import * as css from './styles/titlePane.m.css';
import * as iconCss from '../common/styles/icons.m.css';

/**
 * @type TitlePaneProperties
 *
 * Properties that can be set on a TitlePane component
 *
 * @property closeable          If false the pane will not collapse in response to clicking the title
 * @property headingLevel       'aria-level' for the title's DOM node
 * @property onRequestClose     Called when the title of an open pane is clicked
 * @property onRequestOpen      Called when the title of a closed pane is clicked
 * @property open               If true the pane is opened and content is visible
 * @property title              Title to display above the content
 */
export interface TitlePaneProperties extends ThemeableProperties {
	closeable?: boolean;
	headingLevel?: number;
	onRequestClose?(): void;
	onRequestOpen?(): void;
	open?: boolean;
	title: string;
};

export const TitlePaneBase = AnimatableMixin(ThemeableMixin(WidgetBase));

@theme(css)
@theme(iconCss)
export default class TitlePane extends TitlePaneBase<TitlePaneProperties> {
	private _contentId = uuid();
	private _titleId = uuid();
	private _play = true;

	private _timing: AnimationTimingProperties = {
		duration: 300,
		fill: 'forwards',
		easing: 'ease-in-out'
	};

	_animateOpen() {
		const { size } = this.meta(Dimensions).get('content');

		return [
			{ marginTop: `-${size.height}px` },
			{ marginTop: `0px` }
		];
	}

	_animateClosed() {
		const { size } = this.meta(Dimensions).get('content');

		return [
			{ marginTop: `0px` },
			{ marginTop: `-${size.height}px` }
		];
	}

	private _onTitleClick() {
		this._toggle();
	}

	private _onTitleKeyUp(event: KeyboardEvent) {
		const {keyCode } = event;

		if (keyCode === Keys.Enter || keyCode === Keys.Space) {
			this._toggle();
		}
	}

	private _toggle() {
		const {
			closeable = true,
			onRequestClose,
			onRequestOpen,
			open = true
		} = this.properties;

		if (!closeable) {
			return;
		}

		this._play = true;

		if (open) {
			onRequestClose && onRequestClose();
		}
		else {
			onRequestOpen && onRequestOpen();
		}
	}

	private _onAnimationFinish() {
		this._play = false;
		this.invalidate();
	}

	render(): DNode {
		const {
			closeable = true,
			headingLevel,
			open = true,
			title
		} = this.properties;

		return v('div', {
			classes: this.classes(
				css.root,
				open ? css.open : null
			).fixed(css.rootFixed)
		}, [
			v('div', {
				'aria-level': headingLevel ? String(headingLevel) : null,
				classes: this.classes(
					closeable ? css.closeable : null,
					css.title
				).fixed(
					closeable ? css.closeableFixed : null,
					css.titleFixed
				),
				onclick: this._onTitleClick,
				onkeyup: this._onTitleKeyUp,
				role: 'heading'
			}, [
				v('div', {
					'aria-controls': this._contentId,
					'aria-disabled': closeable ? null : 'true',
					'aria-expanded': String(open),
					classes: this.classes(css.titleButton),
					id: this._titleId,
					role: 'button',
					tabIndex: closeable ? 0 : -1
				}, [
					v('i', {
						classes: this.classes(
							css.arrow,
							iconCss.icon,
							open ? iconCss.downIcon : iconCss.rightIcon
						),
						role: 'presentation',
						'aria-hidden': 'true'
					}),
					title
				])
			]),
			v('div', {
				'aria-hidden': open ? null : 'true',
				'aria-labelledby': this._titleId,
				classes: this.classes(css.content),
				id: this._contentId,
				key: 'content',
				animate: open ? {
					id: 'down',
					effects: this._animateOpen.bind(this),
					timing: this._timing,
					controls: {
						play: this._play,
						onFinish: this._onAnimationFinish.bind(this)
					}
				} : {
					id: 'up',
					effects: this._animateClosed.bind(this),
					timing: this._timing,
					controls: {
						play: this._play,
						onFinish: this._onAnimationFinish.bind(this)
					}
				}
			}, this.children)
		]);
	}
}
