import uuid from '@dojo/core/uuid';
import { DNode } from '@dojo/widget-core/interfaces';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
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
	onRequestClose?(key: string | number | undefined): void;
	onRequestOpen?(key: string | number | undefined): void;
	open?: boolean;
	title: string;
};

export const TitlePaneBase = ThemeableMixin(WidgetBase);

@theme(css)
@theme(iconCss)
export default class TitlePane extends TitlePaneBase<TitlePaneProperties> {
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
			element.style.marginTop = open ? '0px' : `-${ height }px`;
		});
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
			key,
			onRequestClose,
			onRequestOpen,
			open = true
		} = this.properties;

		if (!closeable) {
			return;
		}

		if (open) {
			onRequestClose && onRequestClose(key);
		}
		else {
			onRequestOpen && onRequestOpen(key);
		}
	}

	protected onElementCreated(element: HTMLElement, key: string) {
		key === 'content' && this._afterRender(element);
	}

	protected onElementUpdated(element: HTMLElement, key: string) {
		key === 'content' && this._afterRender(element);
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
				key: 'content'
			}, this.children)
		]);
	}
}
