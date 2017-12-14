import { Dimensions } from '@dojo/widget-core/meta/Dimensions';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { I18nMixin, LocalizedMessages } from '@dojo/widget-core/mixins/I18n';
import { ThemedMixin, theme } from '@dojo/widget-core/mixins/Themed';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

import SlidePane, { Align } from '../slidepane/SlidePane';
import toolbarBundle from './nls/Toolbar';
import * as css from './styles/toolbar.m.css';
import * as iconCss from '../common/styles/icons.m.css';

/**
 * Enum for toolbar positioning
 */
export const enum Position {
	bottom = 'onBottomFixed',
	top = 'onTopFixed'
};

/**
 * @type ToolbarProperties
 *
 * Properties that can be set on a Toolbar component
 *
 * @property actions           Action elements to show in the toolbar
 * @property collapseWidth     Width at which to collapse actions into a SlidePane
 * @property fixed             Fixes the toolbar to the top of the viewport
 * @property onCollapse        Called when action items change their layout
 * @property position          Determines toolbar position in relation to child contet
 * @property title             Element to show as the toolbar title
 */
export interface ToolbarProperties extends WidgetProperties {
	actions?: DNode[];
	collapseWidth?: number;
	fixed?: boolean;
	onCollapse?(collapsed: boolean): void;
	position?: Position;
	title?: DNode;
};

type ToolbarMessages = LocalizedMessages<typeof toolbarBundle.messages>;

export const ThemedBase = I18nMixin(ThemedMixin(WidgetBase));

@theme(css)
@theme(iconCss)
export default class Toolbar extends ThemedBase<ToolbarProperties> {
	private _collapsed = false;
	private _open = false;

	constructor() {
		super();
		window.addEventListener('resize', this._collapseIfNecessary);
	}

	private _closeMenu() {
		this._open = false;
		this.invalidate();
	}

	private _collapseIfNecessary = () => {
		const { collapseWidth = 800, onCollapse } = this.properties;
		const { width } = this.meta(Dimensions).get('root').size;

		if (width > collapseWidth && this._collapsed === true) {
			this._collapsed = false;
			onCollapse && onCollapse(this._collapsed);
			this.invalidate();
		}
		else if (width <= collapseWidth && this._collapsed === false) {
			this._collapsed = true;
			onCollapse && onCollapse(this._collapsed);
			this.invalidate();
		}
	}

	private _toggleMenu() {
		this._open = !this._open;
		this.invalidate();
	}

	protected getFixedRootClasses(): (string | null)[] {
		const { fixed, position = Position.top } = this.properties;
		return [
			css.rootFixed,
			fixed ? css.stickyFixed : null,
			(css as any)[position]
		];
	}

	protected getRootClasses(): (string | null)[] {
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
		window.removeEventListener('resize', this._collapseIfNecessary);
	}

	protected renderActions(messages: ToolbarMessages): DNode {
		const { actions = [], theme } = this.properties;

		const actionsElements = actions.map((action, index) => v('div', {
			classes: [ this.theme(css.action) ],
			key: index
		}, [ action ]));

		if (actionsElements.length === 0) {
			return null;
		}

		return this._collapsed ? w(SlidePane, {
			align: Align.right,
			closeText: messages.close,
			key: 'slide-pane-menu',
			onRequestClose: this._closeMenu,
			open: this._open,
			theme,
			title: 'Menu'
		}, actionsElements) : v('div', {
			classes: [ this.theme(css.actions), css.actionsFixed ],
			key: 'menu'
		}, actionsElements);
	}

	protected renderButton(messages: ToolbarMessages): DNode {
		return this._collapsed ? v('button', {
			classes: [ this.theme(css.menuButton), css.menuButtonFixed ],
			onclick: this._toggleMenu
		}, [
			messages.open,
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
		const classes = this.getRootClasses();
		const fixedClasses = this.getFixedRootClasses();
		const messages = this.localizeBundle(toolbarBundle);

		return v('div', {
			classes: [ ...this.theme(classes), ...fixedClasses ],
			key: 'root'
		}, [
			v('div', {
				classes: [ this.theme(css.toolbar), css.toolbarFixed ]
			}, [
				this.renderTitle(),
				this.renderActions(messages),
				this.renderButton(messages)
			]),
			v('div', {
				classes: [ this.theme(css.content), css.contentFixed ]
			}, this.children)
		]);
	}
}
