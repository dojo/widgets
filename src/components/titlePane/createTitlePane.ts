import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';
import { DNode, Widget, WidgetFactory, WidgetProperties } from '@dojo/widget-core/interfaces';
import themeableMixin, { Themeable } from '@dojo/widget-core/mixins/themeable';

import * as baseTheme from './styles/titlePane';

export interface TitlePaneProperties extends WidgetProperties {
	childNodes?: DNode[];
	onClickTitle?(): void;
	// TODO: title should not be optional
	title?: string;
};

export type TitlePane = Widget<TitlePaneProperties> & Themeable<typeof baseTheme> & {
	onClickTitle?(): void;
};

export interface TitlePaneFactory extends WidgetFactory<TitlePane, TitlePaneProperties> { };

const createTitlePane: TitlePaneFactory = createWidgetBase.mixin(themeableMixin).mixin({
	mixin: {
		// TODO: what is the right way to do this?
		baseTheme: (<any> baseTheme).default.classes,

		onClickTitle: function (this: TitlePane) {
			this.properties.onClickTitle && this.properties.onClickTitle();
		},

		getChildrenNodes: function (this: TitlePane): DNode[] {
			const {
				title = ''
			} = this.properties;

			const children: DNode[] = [
				v('div', {
					classes: this.theme.title,
					onclick: this.onClickTitle
				}, [ title ]),

				v('div', {
					classes: this.theme.content
				}, this.properties.childNodes)
			];

			return children;
		}
	}
});

export default createTitlePane;
