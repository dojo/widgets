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
	private _afterRender(element: HTMLElement) {
		// Conditionally adjut top margin. Done manually instead of through Maquette
		// so the underlying DOM is accessible, as we need to know the content height.
		// Put in a timeout to push this operation to the next tick, otherwise
		// element.offsetHeight below can be incorrect (e.g. before styling is applied)
		setTimeout(() => {
			const { open = true } = this.properties;
			const height = element.offsetHeight;
			element.style.marginTop = open ? '0px' : `-${ height }px`;
		}, 0);
	}

	private _onTitleClick() {
		this._toggle();
	}

	private _onTitleKeyUp(event: KeyboardEvent) {
		if (event.keyCode === /* enter */ 13 ||
			event.keyCode === /* space */ 32) {
				this._toggle();
		}
	}

	private _toggle() {
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

	render(): DNode {
		const {
			ariaHeadingLevel,
			closeable = true,
			open = true,
			title
		} = this.properties;

		const contentId = uuid();
		const titleId = uuid();

		return v('div', {
			classes: this.classes(css.main)
		}, [
			v('div', {
				'aria-level': ariaHeadingLevel ? String(ariaHeadingLevel) : '',
				classes: this.classes(css.title, closeable ? css.closeable : null),
				onclick: closeable ? this._onTitleClick : undefined,
				onkeyup: closeable ? this._onTitleKeyUp : undefined,
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
				classes: this.classes(css.content),
				id: contentId,
				afterCreate: this._afterRender,
				afterUpdate: this._afterRender
			}, this.children)
		]);
	}
}
