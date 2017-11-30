import { debounce } from '@dojo/core/util';
import { Dimensions } from '@dojo/widget-core/meta/Dimensions';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { ThemedMixin, theme } from '@dojo/widget-core/mixins/Themed';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

import SlidePane, { Align } from '../slidepane/SlidePane';
import * as css from './styles/toolbar.m.css';
import * as iconCss from '../common/styles/icons.m.css';

/**
 * @type ToolbarProperties
 *
 * Properties that can be set on a Toolbar component
 *
 * @property collapseWidth     Width at which to collapse actions into a SlidePane
 * @property fixed             Fixes the toolbar to the top of the viewport
 * @property title             Element to show as the toolbar title
 */
export interface ToolbarProperties extends WidgetProperties {
	collapseWidth?: number;
	fixed?: boolean;
	title?: DNode;
};

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@theme(iconCss)
export default class Toolbar extends ThemedBase<ToolbarProperties> {
	private _collapsed = false;
	private _onResize: () => void;
	private _open = false;

	constructor() {
		super();
		this._onResize = debounce(this._collapseIfNecessary, 250);
		window.addEventListener('resize', this._onResize);
	}

	private _closeMenu() {
		this._open = false;
		this.invalidate();
	}

	private _collapseIfNecessary = () => {
		const { collapseWidth = 800 } = this.properties;
		const { width } = this.meta(Dimensions).get('root').size;

		if (width > collapseWidth && this._collapsed === true) {
			this._collapsed = false;
			this.invalidate();
		}
		else if (width <= collapseWidth && this._collapsed === false) {
			this._collapsed = true;
			this.invalidate();
		}
	}

	private _toggleMenu() {
		this._open = !this._open;
		this.invalidate();
	}

	protected getFixedModifierClasses(): (string | null)[] {
		return [
			css.rootFixed,
			this.properties.fixed ? css.stickyFixed : null
		];
	}

	protected getModifierClasses(): (string | null)[] {
		return [
			css.root,
			this._collapsed ? css.collapsed : null,
			this.properties.fixed ? css.sticky : null
		];
	}

	protected onAttach() {
		this._collapseIfNecessary();
	}

	protected onDetach() {
		window.removeEventListener('resize', this._onResize);
	}

	protected renderActions(): DNode {
		const actions = this.children.map((action, index) => v('div', {
			classes: [ this.theme(css.action) ],
			key: index
		}, [ action ]));

		if (actions.length === 0) {
			return null;
		}

		return this._collapsed ? w(SlidePane, {
			align: Align.right,
			closeText: 'close menu',
			key: 'menu',
			onRequestClose: this._closeMenu,
			open: this._open,
			theme: this.properties.theme,
			title: 'Menu'
		}, actions) : v('div', {
			classes: [ this.theme(css.actions), css.actionsFixed ],
			key: 'menu'
		}, actions);
	}

	protected renderButton(): DNode {
		return this._collapsed ? v('button', {
			classes: [ this.theme(css.menuButton), css.menuButtonFixed ],
			onclick: this._toggleMenu
		}, [
			'open menu',
			v('i', {
				classes: this.theme([ iconCss.icon, iconCss.barsIcon ]),
				role: 'presentation', 'aria-hidden': 'true'
			})
		]) : null;
	}

	protected renderTitle(): DNode {
		const { title } = this.properties;

		return title ? v('div', {
			classes: [ this.theme(css.title), css.titleFixed ]
		}, [ title ]) : null;
	}

	render(): DNode {
		const classes = this.getModifierClasses();
		const fixedClasses = this.getFixedModifierClasses();

		return v('div', {
			classes: [ ...this.theme(classes), ...fixedClasses ],
			key: 'root'
		}, [
			this.renderTitle(),
			this.renderActions(),
			this.renderButton()
		]);
	}
}
