import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '@dojo/widgets/middleware/theme';
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
	const fixedClasses = theme.classes(fixedCss);
	const classes = theme.classes(css);
	const { leading, trailing } = children()[0];
	return (
		<div key="root" classes={[fixedClasses.root, css.root]}>
			<div
				key="leading"
				classes={[
					bias === 'leading' && fixedClasses.biased,
					bias === undefined && !shouldCollapse && fixedClasses.even,
					bias === 'trailing' && shouldCollapse && baseCss.visuallyHidden,
					classes.column
				]}
			>
				{leading}
			</div>
			<div
				key="trailing"
				classes={[
					bias === 'trailing' && fixedClasses.biased,
					bias === undefined && !shouldCollapse && fixedClasses.even,
					(bias === 'leading' || bias === undefined) &&
						shouldCollapse &&
						baseCss.visuallyHidden,
					classes.column
				]}
			>
				{trailing}
			</div>
		</div>
	);
});

export default TwoColumnLayout;
