import WidgetBase from '@dojo/framework/core/WidgetBase';
import { v } from '@dojo/framework/core/vdom';
import I18nMixin from '@dojo/framework/core/mixins/I18n';
import ThemedMixin, { theme } from '@dojo/framework/core/mixins/Themed';
import { DNode } from '@dojo/framework/core/interfaces';

import bundle from './nls/Grid';
import * as css from '../theme/default/grid-footer.m.css';

export interface FooterProperties {
	/** The total number of rows */
	total?: number;
	/** The current page */
	page: number;
	/** The number of rows per page */
	pageSize: number;
}

@theme(css)
export default class Footer extends I18nMixin(ThemedMixin(WidgetBase))<FooterProperties> {
	protected render(): DNode {
		const { total, page, pageSize } = this.properties;
		const { format } = this.localizeBundle(bundle);
		const footer =
			total !== undefined
				? format('pageOfTotal', {
						page,
						totalPages: Math.ceil(total / pageSize),
						totalRows: total
				  })
				: format('pageOfUnknownTotal', { page });
		return v('div', { classes: this.theme(css.root) }, [footer]);
	}
}
