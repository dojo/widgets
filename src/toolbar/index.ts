import { Dimensions } from '@dojo/widget-core/meta/Dimensions';
import { DNode } from '@dojo/widget-core/interfaces';
import { I18nMixin } from '@dojo/widget-core/mixins/I18n';
import { ThemedMixin, theme, ThemedProperties } from '@dojo/widget-core/mixins/Themed';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

import SlidePane, { Align } from '../slide-pane/index';
import commonBundle from '../common/nls/common';
import { CommonMessages } from '../common/interfaces';
import * as fixedCss from './styles/toolbar.m.css';
import * as css from '../theme/toolbar/toolbar.m.css';
import * as iconCss from '../theme/common/icons.m.css';
import { GlobalEvent } from '../global-event/index';
import { customElement } from '@dojo/widget-core/decorators/customElement';

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
 * @property menuTitle         Title of the SlidePane that holds collapsed action items
 * @property onCollapse        Called when action items change their layout
 * @property position          Determines toolbar position in relation to child contet
 * @property title             Element to show as the toolbar title
 */
export interface ToolbarProperties extends ThemedProperties {
	actions?: DNode[];
	collapseWidth?: number;
	fixed?: boolean;
	menuTitle?: string;
	onCollapse?(collapsed: boolean): void;
	position?: Position;
	title?: DNode;
};

export const ThemedBase = I18nMixin(ThemedMixin(WidgetBase));

@theme(css)
@theme(iconCss)
@customElement<ToolbarProperties>({
	tag: 'dojo-toolbar',
	properties: [ 'theme', 'extraClasses', 'actions', 'collapseWidth', 'fixed', 'title' ],
	attributes: [ 'key', 'menuTitle', 'position' ],
	events: [
		'onCollapse'
	]
})
export class ToolbarBase<P extends ToolbarProperties = ToolbarProperties> extends ThemedBase<P> {
	private _collapsed = false;
	private _open = false;

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

	private _toggleMenu(event: MouseEvent) {
		event.stopPropagation();
		this._open = !this._open;
		this.invalidate();
	}

	protected getFixedRootClasses(): (string | null)[] {
		const { fixed, position = Position.top } = this.properties;
		return [
			fixedCss.rootFixed,
			fixed ? fixedCss.stickyFixed : null,
			(fixedCss as any)[position]
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

	protected renderActions(messages: CommonMessages): DNode {
		const {
			actions = [],
			theme,
			menuTitle = ''
		} = this.properties;

		const actionsElements = actions.map((action, index) => v('div', {
			classes: [ this.theme(css.action) ],
			key: index
		}, [ action ]));

		if (actionsElements.length === 0) {
			return null;
		}

		return this._collapsed ? w(SlidePane, {
			align: Align.right,
			closeText: `${messages.close} ${menuTitle}`,
			key: 'slide-pane-menu',
			onRequestClose: this._closeMenu,
			open: this._open,
			theme,
			title: menuTitle
		}, actionsElements) : v('div', {
			classes: [ this.theme(css.actions), fixedCss.actionsFixed ],
			key: 'menu'
		}, actionsElements);
	}

	protected renderButton(messages: CommonMessages): DNode {
		const { menuTitle = '' } = this.properties;
		return this._collapsed ? v('button', {
			classes: [ this.theme(css.menuButton), fixedCss.menuButtonFixed ],
			type: 'button',
			onclick: this._toggleMenu
		}, [
			`${messages.open} ${menuTitle}`,
			v('i', {
				classes: this.theme([ iconCss.icon, iconCss.barsIcon ]),
				role: 'presentation', 'aria-hidden': 'true'
			})
		]) : null;
	}

	protected renderTitle(): DNode {
		const { title } = this.properties;

		return title ? v('div', {
			classes: [ this.theme(css.title), fixedCss.titleFixed ]
		}, [ title ]) : null;
	}

	render(): DNode {
		const classes = this.getRootClasses();
		const fixedClasses = this.getFixedRootClasses();
		const messages = this.localizeBundle(commonBundle);

		return v('div', {
			classes: [ ...this.theme(classes), ...fixedClasses ],
			key: 'root'
		}, [
			w(GlobalEvent, { key: 'global', window: { resize: this._collapseIfNecessary } }),
			v('div', {
				classes: [ this.theme(css.toolbar), fixedCss.toolbarFixed ]
			}, [
				this.renderTitle(),
				this.renderActions(messages),
				this.renderButton(messages)
			]),
			v('div', {
				classes: [ this.theme(css.content), fixedCss.contentFixed ]
			}, this.children)
		]);
	}
}

export default class Toolbar extends ToolbarBase<ToolbarProperties> {}
