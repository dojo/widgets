import { VNodeProperties } from '@dojo/interfaces/vdom';
import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';
import { DNode, Widget, WidgetFactory, WidgetProperties } from '@dojo/widget-core/interfaces';
import themeableMixin, { Themeable } from '@dojo/widget-core/mixins/themeable';

import * as baseTheme from './styles/titlePane';

export interface TitlePaneProperties extends WidgetProperties {
	collapsed?: boolean;
	collapsible?: boolean;
	// TODO: title should not be optional
	title?: string;

	onRequestCollapse?(): void;
	onRequestExpand?(): void;
};

export type TitlePane = Widget<TitlePaneProperties> & Themeable<typeof baseTheme> & {
	onClickTitle?(): void;
};

export interface TitlePaneFactory extends WidgetFactory<TitlePane, TitlePaneProperties> { };

const createTitlePane: TitlePaneFactory = createWidgetBase
.mixin(themeableMixin)
.mixin({
	mixin: {
		// FIXME
		baseTheme: (<any> baseTheme).default.classes,

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
				title = ''
			} = this.properties;

			const titleProperties: VNodeProperties = { classes: {} };

			// FIXME
			Object.keys(this.theme.title).forEach(function (className) {
				(<any> titleProperties.classes)[className] = true;
			});

			if (collapsible) {
				// FIXME
				Object.keys(this.theme.collapsible).forEach(function (className) {
					(<any> titleProperties.classes)[className] = true;
				});
				titleProperties.onclick = this.onClickTitle;
			}

			const children: DNode[] = [
				v('div', titleProperties, [ title ])
			];

			if (!collapsed) {
				children.push(v('div', {
					classes: this.theme.content
				}, this.children));
			}

			return children;
		}
	}
});

export default createTitlePane;
