import { Dimensions } from '@dojo/widget-core/meta/Dimensions';
import { DNode } from '@dojo/widget-core/interfaces';
import { I18nMixin } from '@dojo/widget-core/mixins/I18n';
import { ThemedMixin, theme, ThemedProperties } from '@dojo/widget-core/mixins/Themed';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

import Icon from '../icon/index';
import SlidePane, { Align } from '../slide-pane/index';
import commonBundle from '../common/nls/common';
import { CommonMessages } from '../common/interfaces';
import * as fixedCss from './styles/toolbar.m.css';
import * as css from '../theme/toolbar.m.css';
import { GlobalEvent } from '../global-event/index';
import { customElement } from '@dojo/widget-core/decorators/customElement';

/**
 * Enum for toolbar positioning
 */
export const enum Position {
	bottom = 'onBottomFixed',
	top = 'onTopFixed'
}

/**
 * @type ToolbarProperties
 *
 * Properties that can be set on a Toolbar component
 *
 * @property collapseWidth     Width at which to collapse actions into a SlidePane
 * @property fixed             Fixes the toolbar to the top of the viewport
 * @property onCollapse        Called when action items change their layout
 * @property position          Determines toolbar position in relation to child contet
 * @property heading           The toolbar heading
 */
export interface ToolbarProperties extends ThemedProperties {
	collapseWidth?: number;
	fixed?: boolean;
	onCollapse?(collapsed: boolean): void;
	position?: Position;
	heading?: string;
}

export const ThemedBase = I18nMixin(ThemedMixin(WidgetBase));

@theme(css)
@customElement<ToolbarProperties>({
	tag: 'dojo-toolbar',
	properties: [ 'theme', 'extraClasses', 'collapseWidth', 'fixed' ],
	attributes: [ 'key', 'heading', 'position' ],
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
		const { fixed } = this.properties;
		let { position = Position.top } = this.properties;

		if (position === Position.bottom && !fixed) {
			console.warn('Bottom positioning can be used only when `fixed` is `true`.');
			position = Position.top;
		}

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

	protected renderActions(): DNode {
		const { close } = this.localizeBundle(commonBundle);

		const {
			theme,
			heading
		} = this.properties;

		return this._collapsed ? w(SlidePane, {
			align: Align.right,
			closeText: close,
			key: 'slide-pane-menu',
			onRequestClose: this._closeMenu,
			open: this._open,
			theme,
			title: heading
		}, this.children) : v('div', {
			classes: [ this.theme(css.actions), fixedCss.actionsFixed ],
			key: 'menu'
		}, this.children);
	}

	protected renderButton(): DNode {
		const { open } = this.localizeBundle(commonBundle);

		return v('button', {
			classes: [ this.theme(css.menuButton), fixedCss.menuButtonFixed ],
			type: 'button',
			onclick: this._toggleMenu
		}, [
			open,
			w(Icon, { type: 'barsIcon' })
		]);
	}

	protected render(): DNode {
		const {
			heading,
			fixed
		} = this.properties;

		let styles = {};
		if (fixed) {
			const { height } = this.meta(Dimensions).get('toolbar').size;
			styles = { height: `${height}px` };
		}

		const hasActions = this.children && this.children.length;

		return v('div', {
			key: 'root',
			classes: fixedCss.containerFixed,
			styles
		}, [
			w(GlobalEvent, { key: 'global', window: { resize: this._collapseIfNecessary } }),
			v('div', {
				classes: [
					...this.theme(this.getRootClasses()),
					...this.getFixedRootClasses()
				],
				key: 'toolbar'
			}, [
				heading ? v('div', {
					classes: [ this.theme(css.title), fixedCss.titleFixed ]
				}, [ heading ]) : null,
				hasActions ? this.renderActions() : null,
				hasActions && this._collapsed ? this.renderButton() : null
			])
		]);

	}
}

export default class Toolbar extends ToolbarBase<ToolbarProperties> {}
