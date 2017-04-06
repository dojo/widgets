import { debounce } from '@dojo/core/util';
import Observable from '@dojo/shim/Observable';
import { v, w } from '@dojo/widget-core/d';
import ThemeableMixin, { theme, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import * as css from './styles/menuBar.m.css';
import SlidePane from '../slidepane/SlidePane';

export interface MenuBarProperties extends ThemeableProperties {
	breakpoint?: number;
	slidePaneButtonLabel?: string;
	slidePaneStyles?: any;
	onRequestClose?: () => void;
	onRequestOpen?: () => void;
	open?: boolean;
}

// TODO: Make this a hot observable with Evented?
// TODO: Should this be moved into a common utility method that can be used by any widget?
const viewportSource = new Observable((observer) => {
	const listener = function () {
		observer.next(document.body.offsetWidth);
	};
	window.addEventListener('resize', listener);
	return function () {
		window.removeEventListener('resize', listener);
	};
});

const MenuBarBase = ThemeableMixin(WidgetBase);

@theme(css)
export class MenuBar extends MenuBarBase<MenuBarProperties> {
	constructor() {
		super();
		this._observeViewport();
	}

	render() {
		const { breakpoint } = this.properties;
		const vw = document.body.offsetWidth;

		if (!breakpoint || vw >= breakpoint) {
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
			slidePaneButtonLabel,
			slidePaneStyles
		} = this.properties;

		return v('div', {
			classes: this.classes(css.navBar, css.slidePane)
		}, [
			v('button', {
				classes: this.classes(css.slidePaneButton),
				onclick: this._onSlidePaneClick
			}, slidePaneButtonLabel ? [ slidePaneButtonLabel ] : undefined),

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
		// TODO: If the current vw is stored as a private variable, then it would
		// be possible to invalidate only when the vw crosses the breakpoint.
		const viewportSubscription = viewportSource.subscribe({
			next: debounce(() => {
				const { breakpoint } = this.properties;
				if (typeof breakpoint === 'number') {
					this.invalidate();
				}
			}, 200)
		});
		this.own({
			destroy() {
				viewportSubscription.unsubscribe();
			}
		});
	}
}

export default MenuBar;
