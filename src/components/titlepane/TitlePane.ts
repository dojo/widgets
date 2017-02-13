import uuid from '@dojo/core/uuid';
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';

import * as css from './styles/titlePane.css';
import * as animations from '../../styles/animations.css';

export interface TitlePaneProperties extends ThemeableProperties {
	ariaHeadingLevel?: number;
	closeable?: boolean;
	enterAnimation?: string;
	exitAnimation?: string;
	open?: boolean;
	title: string;

	onRequestClose?(): void;
	onRequestOpen?(): void;
};

export const TitlePaneBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class TitlePane extends TitlePaneBase<TitlePaneProperties> {
	onClickTitle() {
		const {
			open = true
		} = this.properties;

		if (open) {
			this.properties.onRequestClose && this.properties.onRequestClose();
		}
		else {
			this.properties.onRequestOpen && this.properties.onRequestOpen();
		}
	}

	render(): DNode {
		const {
			ariaHeadingLevel,
			closeable = true,
			enterAnimation = animations.expandDown,
			exitAnimation = animations.collapseUp,
			open = true,
			title = ''
		} = this.properties;

		const contentId = uuid();
		const titleId = uuid();

		const children: DNode[] = [
			v('div', {
				'aria-level': ariaHeadingLevel ? String(ariaHeadingLevel) : '',
				classes: this.classes(css.title, closeable ? css.closeable : null).get(),
				onclick: closeable ? this.onClickTitle : undefined,
				role: 'heading'
			}, [
				v('div', {
					'aria-controls': open ? contentId : '',
					'aria-disabled': String(!closeable),
					'aria-expanded': String(open),
					id: titleId,
					role: 'button'
				}, [ title ])
			])
		];

		if (open) {
			children.push(v('div', {
				'aria-labelledby': titleId,
				classes: this.classes(css.content).get(),
				id: contentId,
				enterAnimation,
				exitAnimation
			}, this.children));
		}

		return v('div', {
			classes: this.classes(css.main).get()
		}, children);
	}
}
