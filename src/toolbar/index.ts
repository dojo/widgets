import { Dimensions } from '@dojo/framework/widget-core/meta/Dimensions';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import { I18nMixin } from '@dojo/framework/widget-core/mixins/I18n';
import { ThemedMixin, theme, ThemedProperties } from '@dojo/framework/widget-core/mixins/Themed';
import { v, w } from '@dojo/framework/widget-core/d';
import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';

import Icon from '../icon/index';
import SlidePane, { Align } from '../slide-pane/index';
import commonBundle from '../common/nls/common';
import { CommonMessages } from '../common/interfaces';
import * as fixedCss from './styles/toolbar.m.css';
import * as css from '../theme/toolbar.m.css';
import { GlobalEvent } from '../global-event/index';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';

/**
 * @type ToolbarProperties
 *
 * Properties that can be set on a Toolbar component
 *
 * @property collapseWidth     Width at which to collapse actions into a SlidePane
 * @property onCollapse        Called when action items change their layout
 * @property heading           The toolbar heading
 */
export interface ToolbarProperties extends ThemedProperties {
	collapseWidth?: number;
	onCollapse?(collapsed: boolean): void;
	heading?: string;
}

@theme(css)
@customElement<ToolbarProperties>({
	tag: 'dojo-toolbar',
	properties: [ 'theme', 'classes', 'extraClasses', 'collapseWidth' ],
	attributes: [ 'key', 'heading' ],
	events: [
		'onCollapse'
	]
})
export class Toolbar extends I18nMixin(ThemedMixin(WidgetBase))<ToolbarProperties> {
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

	protected onAttach() {
		this._collapseIfNecessary();
	}

	protected renderActions(): DNode {
		const { close } = this.localizeBundle(commonBundle).messages;

		const {
			theme,
			classes,
			heading
		} = this.properties;
		const actions = v('div', {
			classes: this.theme(css.actions),
			key: 'menu'
		}, this.children);

		return this._collapsed ? w(SlidePane, {
			align: Align.right,
			closeText: close,
			key: 'slide-pane-menu',
			onRequestClose: this._closeMenu,
			open: this._open,
			theme,
			classes,
			title: heading
		}, [ actions ]) : actions;
	}

	protected renderButton(): DNode {
		const { open } = this.localizeBundle(commonBundle).messages;
		const { theme, classes } = this.properties;

		return v('button', {
			classes: this.theme(css.menuButton),
			type: 'button',
			onclick: this._toggleMenu
		}, [
			open,
			w(Icon, { type: 'barsIcon', theme, classes })
		]);
	}

	protected render(): DNode {
		const {
			heading
		} = this.properties;

		const hasActions = this.children && this.children.length;

		return v('div', {
			key: 'root',
			classes: [
				fixedCss.rootFixed,
				...this.theme([
					css.root,
					this._collapsed ? css.collapsed : null
				])
			]
		}, [
			w(GlobalEvent, { key: 'global', window: { resize: this._collapseIfNecessary } }),
			heading ? v('div', {
				classes: this.theme(css.title)
			}, [ heading ]) : null,
			hasActions ? this.renderActions() : null,
			hasActions && this._collapsed ? this.renderButton() : null
		]);
	}
}

export default Toolbar;
