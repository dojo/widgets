import WidgetBase from '@dojo/framework/core/WidgetBase';
import { v } from '@dojo/framework/core/vdom';
import ThemedMixin, { theme } from '@dojo/framework/core/mixins/Themed';
import { DNode } from '@dojo/framework/core/interfaces';
import * as css from '../theme/grid-placeholder-row.m.css';

@theme(css)
export default class PlaceholderRow extends ThemedMixin(WidgetBase) {
	protected render(): DNode {
		return v('div', { classes: this.theme(css.root) }, [
			v('div', { classes: this.theme(css.loading) })
		]);
	}
}
