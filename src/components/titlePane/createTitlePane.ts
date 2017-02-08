import { VNodeProperties } from '@dojo/interfaces/vdom';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';
import { DNode, Widget, WidgetFactory, WidgetProperties } from '@dojo/widget-core/interfaces';
import themeable, { ThemeableMixin } from '@dojo/widget-core/mixins/themeable';

import * as css from './styles/titlePane.css';
import * as animations from '../../styles/animations.css';

export interface TitlePaneProperties extends WidgetProperties {
	collapsed?: boolean;
	collapsible?: boolean;
	enterAnimation?: string;
	exitAnimation?: string;
	title: string;

	onRequestCollapse?(): void;
	onRequestExpand?(): void;
};

export type TitlePane = Widget<TitlePaneProperties> & ThemeableMixin & {
	onClickTitle?(): void;
};

export interface TitlePaneFactory extends WidgetFactory<TitlePane, TitlePaneProperties> { };

const createTitlePane: TitlePaneFactory = createWidgetBase
	.mixin(themeable)
	.mixin({
		mixin: {
			baseClasses: css,

			onClickTitle: function (this: TitlePane) {
				const {
					properties: {
						collapsed = false
					}
				} = this;

				if (collapsed) {
					this.properties.onRequestExpand && this.properties.onRequestExpand();
				}
				else {
					this.properties.onRequestCollapse && this.properties.onRequestCollapse();
				}
			},

			getChildrenNodes: function (this: TitlePane): DNode[] {
				const {
					collapsed = false,
					collapsible = true,
					enterAnimation = animations.slideInDown,
					exitAnimation = animations.slideOutUp,
					title = ''
				} = this.properties;

				let titleProperties: VNodeProperties;

				if (collapsible) {
					titleProperties = {
						classes: this.classes(css.title, css.collapsible).get(),
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

				if (!collapsed) {
					children.push(v('div', {
						classes: this.classes(css.content).get(),
						enterAnimation,
						exitAnimation
					}, this.children));
				}

				return children;
			}
		}
	});

export default createTitlePane;
