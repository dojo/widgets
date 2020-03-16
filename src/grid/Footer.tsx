import WidgetBase from '@dojo/framework/core/WidgetBase';
import { v } from '@dojo/framework/core/vdom';
import I18nTheme from '@dojo/framework/core/mixins/I18n';
import ThemedMixin, { theme } from '@dojo/framework/core/mixins/Themed';
import { DNode } from '@dojo/framework/core/interfaces';

import defaultBundle from './nls/Grid';
import * as css from '../theme/default/grid-footer.m.css';

export interface FooterProperties {
	/** optional message bundle to override the included bundle */
	bundle?: typeof defaultBundle;
	/** The total number of rows */
	total?: number;
	/** The current page */
	page: number;
	/** The number of rows per page */
	pageSize: number;
}

@theme(css)
export default class Footer extends I18nTheme(ThemedMixin(WidgetBase))<FooterProperties> {
	protected render(): DNode {
		const { bundle, total, page, pageSize } = this.properties;
		const { format } = this.localizeBundle(bundle || defaultBundle);
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
