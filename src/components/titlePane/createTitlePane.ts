import createWidgetBase from '@dojo/widget-core/createWidgetBase';
import { v } from '@dojo/widget-core/d';
import { DNode, Widget, WidgetFactory, WidgetProperties } from '@dojo/widget-core/interfaces';
import internalStateFactory, { InternalState } from '@dojo/widget-core/mixins/internalState';
import themeableMixin, { Themeable } from '@dojo/widget-core/mixins/themeable';

import * as baseTheme from './styles/titlePane';

export interface TitlePaneProperties extends WidgetProperties {
	// TODO: set default state from properties
	collapsed?: boolean;
	// TODO: add logic for this
	collapsible?: boolean;
	// TODO: title should not be optional
	title?: string;

	onCollapse?(): void;
	onExpand?(): void;
};

export type TitlePane = Widget<TitlePaneProperties> & InternalState & Themeable<typeof baseTheme> & {
	onClickTitle?(): void;
};

export interface TitlePaneFactory extends WidgetFactory<TitlePane, TitlePaneProperties> { };

const createTitlePane: TitlePaneFactory = createWidgetBase
.mixin(internalStateFactory)
.mixin(themeableMixin)
.mixin({
	mixin: {
		// TODO: what is the right way to do this?
		baseTheme: (<any> baseTheme).default.classes,

		onClickTitle: function (this: TitlePane) {
			// TODO: any
			const collapsed = !(<any> this.state).collapsed;

			if (collapsed) {
				this.properties.onCollapse && this.properties.onCollapse();
			}
			else {
				this.properties.onExpand && this.properties.onExpand();
			}

			this.setState({
				collapsed
			});
		},

		getChildrenNodes: function (this: TitlePane): DNode[] {
			const {
				title = ''
			} = this.properties;

			const {
				collapsed
			} = this.state;

			const children: DNode[] = [
				v('div', {
					// TODO: also apply 'collapsible' class if appropriate
					classes: this.theme.title,
					onclick: this.onClickTitle
				}, [ title ])
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
