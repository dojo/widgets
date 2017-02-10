import { VNodeProperties } from '@dojo/interfaces/vdom';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';
import { DNode, Widget, WidgetFactory, WidgetProperties } from '@dojo/widget-core/interfaces';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';

import * as css from './styles/titlePanel.css';
import * as animations from '../../styles/animations.css';

export interface TitlePanelProperties extends WidgetProperties {
	open?: boolean;
	closeable?: boolean;
	enterAnimation?: string;
	exitAnimation?: string;
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
					closeable = true,
					enterAnimation = animations.expandDown,
					exitAnimation = animations.collapseUp,
					open = true,
					title = ''
				} = this.properties;

				let titleProperties: VNodeProperties;

				if (closeable) {
					titleProperties = {
						classes: this.classes(css.title, css.closeable).get(),
						onclick: this.onClickTitle
					};
				}
				else {
					titleProperties = {
						classes: this.classes(css.title).get()
					};
				}

				const children: DNode[] = [
					v('div', titleProperties, [ title ])
				];

				if (open) {
					children.push(v('div', {
						classes: this.classes(css.content).get(),
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
