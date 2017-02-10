import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';
import { DNode, Widget, WidgetFactory, WidgetProperties } from '@dojo/widget-core/interfaces';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';

import * as css from './styles/titlePanel.css';
import * as animations from '../../styles/animations.css';

export interface TitlePanelProperties extends WidgetProperties {
	ariaHeadingLevel?: number;
	closeable?: boolean;
	enterAnimation?: string;
	exitAnimation?: string;
	open?: boolean;
	title: string;

	onRequestClose?(): void;
	onRequestOpen?(): void;
};

export type TitlePanel = Widget<TitlePanelProperties> & ThemeableMixin & {
	onClickTitle(): void;
};

export interface TitlePanelFactory extends WidgetFactory<TitlePanel, TitlePanelProperties> { };

const createTitlePanel: TitlePanelFactory = createWidgetBase
	.mixin(themeable)
	.mixin({
		mixin: {
			baseClasses: css,

			onClickTitle(this: TitlePanel) {
				const {
					properties: {
						open = true
					}
				} = this;

				if (open) {
					this.properties.onRequestClose && this.properties.onRequestClose();
				}
				else {
					this.properties.onRequestOpen && this.properties.onRequestOpen();
				}
			},

			render(this: TitlePanel): DNode {
				const {
					ariaHeadingLevel,
					closeable = true,
					enterAnimation = animations.expandDown,
					exitAnimation = animations.collapseUp,
					open = true,
					title = ''
				} = this.properties;

				const children: DNode[] = [
					v('div', {
						'aria-level': ariaHeadingLevel ? String(ariaHeadingLevel) : '',
						classes: this.classes(css.title, closeable ? css.closeable : null).get(),
						onclick: closeable ? this.onClickTitle : undefined,
						role: 'heading'
					}, [
						v('div', {
							// FIXME - id of content
							'aria-controls': open ? 'content' : '',
							'aria-disabled': String(!closeable),
							'aria-expanded': String(open),
							// FIXME - set unique id
							id: 'titlebutton',
							role: 'button'
						}, [ title ])
					])
				];

				if (open) {
					children.push(v('div', {
						// FIXME - id of title button
						'aria-labelledby': 'titlebutton',
						classes: this.classes(css.content).get(),
						// FIXME - set unique id
						id: 'content',
						enterAnimation,
						exitAnimation
					}, this.children));
				}

				return v('div', {
					classes: this.classes(css.main).get()
				}, children);
			}
		}
	});

export default createTitlePanel;
