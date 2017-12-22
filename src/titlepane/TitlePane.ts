import uuid from '@dojo/core/uuid';
import { DNode } from '@dojo/widget-core/interfaces';
import { theme, ThemedMixin, ThemedProperties } from '@dojo/widget-core/mixins/Themed';
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

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
export interface TitlePaneProperties extends ThemedProperties {
	closeable?: boolean;
	headingLevel?: number;
	onRequestClose?(key: string | number | undefined): void;
	onRequestOpen?(key: string | number | undefined): void;
	open?: boolean;
	title: string;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@theme(iconCss)
export default class TitlePane<P extends TitlePaneProperties = TitlePaneProperties> extends ThemedBase<P> {
	private _contentId = uuid();
	private _titleId = uuid();

	private _afterRender(element: HTMLElement) {
		// Conditionally adjust top margin. Done manually instead of through Maquette
		// so the underlying DOM is accessible, as we need to know the content height.
		// Put in a rAF to push this operation to the next tick, otherwise
		// element.offsetHeight can be incorrect (e.g. before styling is applied)
		// Note that this will go away when meta support is added to widget-core
		requestAnimationFrame(() => {
			const { open = true } = this.properties;
			const height = element.offsetHeight;
			element.style.marginTop = open ? '0px' : `-${height}px`;
		});
	}

	private _onTitleClick() {
		this._toggle();
	}

	private _toggle() {
		const { closeable = true, key, onRequestClose, onRequestOpen, open = true } = this.properties;

		if (!closeable) {
			return;
		}

		if (open) {
			onRequestClose && onRequestClose(key);
		} else {
			onRequestOpen && onRequestOpen(key);
		}
	}

	protected onElementCreated(element: HTMLElement, key: string) {
		key === 'content' && this._afterRender(element);
	}

	protected onElementUpdated(element: HTMLElement, key: string) {
		key === 'content' && this._afterRender(element);
	}

	protected getButtonContent(): DNode {
		return this.properties.title;
	}

	protected getFixedModifierClasses(): (string | null)[] {
		const { closeable = true } = this.properties;
		return [closeable ? css.closeableFixed : null];
	}

	protected getModifierClasses(): (string | null)[] {
		const { closeable = true } = this.properties;
		return [closeable ? css.closeable : null];
	}

	protected getPaneContent(): DNode[] {
		return this.children;
	}

	protected renderExpandIcon(): DNode {
		const { open = true } = this.properties;
		return v('i', {
			classes: this.theme([css.arrow, iconCss.icon, open ? iconCss.downIcon : iconCss.rightIcon]),
			role: 'presentation',
			'aria-hidden': 'true'
		});
	}

	render(): DNode {
		const { closeable = true, headingLevel, open = true } = this.properties;

		// prettier-ignore
		return v('div', {
			classes: [ ...this.theme([
				css.root,
				open ? css.open : null
			]), css.rootFixed ]
		}, [
			v('div', {
				'aria-level': headingLevel ? String(headingLevel) : null,
				classes: [ ...this.theme([ css.title, ...this.getModifierClasses() ]), css.titleFixed, ...this.getFixedModifierClasses() ],
				role: 'heading'
			}, [
				v('button', {
					'aria-controls': this._contentId,
					'aria-expanded': String(open),
					disabled: !closeable,
					classes: this.theme(css.titleButton),
					id: this._titleId,
					onclick: this._onTitleClick
				}, [
					this.renderExpandIcon(),
					this.getButtonContent()
				])
			]),
			v('div', {
				'aria-hidden': open ? null : 'true',
				'aria-labelledby': this._titleId,
				classes: this.theme(css.content),
				id: this._contentId,
				key: 'content'
			}, this.getPaneContent())
		]);
	}
}
