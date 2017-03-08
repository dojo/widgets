import uuid from '@dojo/core/uuid';
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';

import * as css from './styles/titlePane.css';

/**
 * @type TitlePaneProperties
 *
 * Properties that can be set on a TitlePane component
 *
 * @property ariaHeadingLevel	'aria-heading-level' for the title's DOM node
 * @property closeable			If false the pane will not collapse in response to clicking the title
 * @property open				If true the pane is opened and content is visible
 * @property title				Title to display in above the content
 * @property onRequestClose		Called when the title of an open pane is clicked
 * @property onRequestOpen		Called when the title of a closed pane is clicked
 */
export interface TitlePaneProperties extends ThemeableProperties {
	ariaHeadingLevel?: number;
	closeable?: boolean;
	open?: boolean;
	title: string;

	onRequestClose?(): void;
	onRequestOpen?(): void;
};

export const TitlePaneBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class TitlePane extends TitlePaneBase<TitlePaneProperties> {
	private _content: HTMLElement;
	private _wasOpen: boolean;

	onTitleClick() {
		const {
			open = true,
			onRequestClose,
			onRequestOpen
		} = this.properties;

		if (open) {
			onRequestClose && onRequestClose();
		}
		else {
			onRequestOpen && onRequestOpen();
		}
	}

	cacheContent(element: HTMLElement) {
		this._content = <HTMLElement> element.querySelector(`.${ css.content }`);
	}

	render(): DNode {
		const {
			ariaHeadingLevel,
			closeable = true,
			open = true,
			title
		} = this.properties;

		const contentId = uuid();
		const titleId = uuid();

		this._wasOpen = !open;

		return v('div', {
			classes: this.classes(css.main),
			afterCreate: this.cacheContent,
			afterUpdate: this.cacheContent
		}, [
			v('div', {
				'aria-level': ariaHeadingLevel ? String(ariaHeadingLevel) : '',
				classes: this.classes(css.title, closeable ? css.closeable : null),
				onclick: closeable ? this.onTitleClick : undefined,
				role: 'heading'
			}, [
				v('div', {
					'aria-controls': contentId,
					'aria-disabled': String(!closeable),
					'aria-expanded': String(open),
					id: titleId,
					role: 'button',
					tabIndex: closeable ? 0 : -1
				}, [ title ])
			]),
			v('div', {
				'aria-labelledby': titleId,
				classes: this.classes(
					css.content,
					open ? css.open : null
				),
				id: contentId,
				styles: {
					height: (open && this._content) ? `${ this._content.offsetHeight }px` : null
				}
			}, this.children)
		]);
	}
}
