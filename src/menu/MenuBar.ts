import { createHandle } from '@dojo/core/lang';
import { debounce } from '@dojo/core/util';
import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import ThemeableMixin, { theme, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import * as css from './styles/menuBar.m.css';
import SlidePane from '../slidepane/SlidePane';
import { observeViewport } from '../common/util';

/**
 * @type MenuBarProperties
 *
 * Properties that can be set on a MenuBar component.
 *
 * @property breakpoint             The viewport width beneath which all children should be rendered to a SlidePane.
 * @property slidePaneStyles        Override styles for the SlidePane.
 * @property slidePaneTrigger       Text for the `SlidePane` toggle, or a function that returns a DNode.
 * @property onRequestClose         Called when the pane is swiped closed or the underlay is clicked or tapped.
 * @property onRequestOpen          Called when the pane opens.
 * @property open                   Specifies whether the SlidePane is opened.
 */
export interface MenuBarProperties extends ThemeableProperties {
	breakpoint: number;
	slidePaneStyles?: any;
	slidePaneTrigger?: string | ((onClick: () => void) => DNode);
	onRequestClose?: () => void;
	onRequestOpen?: () => void;
	open?: boolean;
}

const MenuBarBase = ThemeableMixin(WidgetBase);

@theme(css)
export class MenuBar extends MenuBarBase<MenuBarProperties> {
	private _vw = document.body.offsetWidth;

	constructor() {
		/* istanbul ignore next: disregard transpiled `super`'s "else" block */
		super();
		this._observeViewport();
	}

	render() {
		const { breakpoint } = this.properties;

		if (!breakpoint || this._vw >= breakpoint) {
			return v('header', {
				classes: this.classes(css.navBar)
			}, this.children);
		}

		return this.renderSlidePane();
	}

	renderSlidePane() {
		const {
			onRequestClose,
			open,
			slidePaneStyles,
			slidePaneTrigger
		} = this.properties;

		const trigger = typeof slidePaneTrigger === 'function' ?
			slidePaneTrigger(this._onSlidePaneClick.bind(this)) :
			v('button', {
				classes: this.classes(css.slidePaneButton),
				onclick: this._onSlidePaneClick
			}, slidePaneTrigger ? [ slidePaneTrigger ] : undefined);

		return v('div', {
			classes: this.classes(css.navBar, css.slidePane)
		}, [
			trigger,
			w(SlidePane, {
				onRequestClose,
				open,
				overrideClasses: slidePaneStyles
			}, this.children)
		]);
	}

	private _onSlidePaneClick() {
		this.properties.onRequestOpen && this.properties.onRequestOpen();
	}

	private _observeViewport() {
		const viewportSubscription = observeViewport({
			next: debounce((vw: number) => {
				const { breakpoint } = this.properties;
				const previous = this._vw;
				this._vw = vw;

				if (vw > breakpoint && previous <= breakpoint || vw < breakpoint && previous >= breakpoint) {
					this.invalidate();
				}
			}, 200)
		});
		this.own(createHandle(() => {
			viewportSubscription.unsubscribe();
		}));
	}
}

export default MenuBar;
