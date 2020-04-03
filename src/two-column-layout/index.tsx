import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '../middleware/theme';
import * as fixedCss from './styles/two-column-layout.m.css';
import * as css from '../theme/default/two-column-layout.m.css';
import * as baseCss from '../common/styles/base.m.css';
import breakpoint from '@dojo/framework/core/middleware/breakpoint';

export interface TwoColumnLayoutProperties {
	bias?: 'leading' | 'trailing';
	breakpoint?: number;
}

export interface TwoColumnLayoutChildren {
	leading: RenderResult;
	trailing: RenderResult;
}

const factory = create({ theme, breakpoint })
	.properties<TwoColumnLayoutProperties>()
	.children<TwoColumnLayoutChildren>();

export const TwoColumnLayout = factory(function({
	properties,
	children,
	middleware: { theme, breakpoint: breakpointMiddleware }
}) {
	const { bias, breakpoint = 600 } = properties();
	const { breakpoint: currentBreakpoint } = breakpointMiddleware.get('root', {
		SMALL: 0,
		LARGE: breakpoint
	}) || { breakpoint: 'LARGE' };
	const shouldCollapse = currentBreakpoint === 'SMALL';
	const classes = theme.classes(css);
	const { leading, trailing } = children()[0];
	return (
		<div key="root" classes={[theme.variant(), fixedCss.root, classes.root]}>
			<div
				key="leading"
				classes={[
					bias === 'leading' && fixedCss.biased,
					bias === undefined && !shouldCollapse && fixedCss.even,
					bias === 'trailing' && shouldCollapse && baseCss.visuallyHidden,
					bias === 'trailing' && !shouldCollapse && classes.small,
					classes.column
				]}
			>
				{leading}
			</div>
			<div
				key="trailing"
				classes={[
					bias === 'trailing' && fixedCss.biased,
					bias === undefined && !shouldCollapse && fixedCss.even,
					(bias === 'leading' || bias === undefined) &&
						shouldCollapse &&
						baseCss.visuallyHidden,
					bias === 'leading' && !shouldCollapse && classes.small,
					classes.column
				]}
			>
				{trailing}
			</div>
		</div>
	);
});

export default TwoColumnLayout;
