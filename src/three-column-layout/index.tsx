import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import breakpoint from '@dojo/framework/core/middleware/breakpoint';
import theme from '../middleware/theme';
import * as fixedCss from './styles/three-column-layout.m.css';
import * as baseCss from '../common/styles/base.m.css';
import * as css from '../theme/default/three-column-layout.m.css';

export interface ThreeColumnLayoutProperties {
	/** The breakpoint at which one column should collapse. Defaults to 1024px.
	 * The column that collapses will be the trailing column by default or the column that is not specified by the
	 * `bias` property if it is provided
	 */
	twoColumnBreakpoint?: number;
	/** The breakpoint at which both side columns will collapse. Defaults to 600px. */
	oneColumnBreakpoint?: number;
	/** Determines which column is more important, and will remain at the `twoColumnBreakpoint`. Defaults to `'leading'`. */
	bias?: 'leading' | 'trailing';
}

export interface ThreeColumnLayoutChildren {
	/** The content for the leading column */
	leading: RenderResult;
	/** The content for the center column */
	center: RenderResult;
	/** The content for the trailing column */
	trailing: RenderResult;
}

const factory = create({ breakpoint, theme })
	.properties<ThreeColumnLayoutProperties>()
	.children<ThreeColumnLayoutChildren>();

export const ThreeColumnLayout = factory(function({
	properties,
	children,
	middleware: { breakpoint, theme }
}) {
	const {
		twoColumnBreakpoint = 1024,
		oneColumnBreakpoint = 600,
		bias = 'leading'
	} = properties();
	const [{ leading, center, trailing }] = children();
	const classes = theme.classes(css);
	const { breakpoint: currentBreakpoint } = breakpoint.get('root', {
		LARGE: twoColumnBreakpoint,
		MEDIUM: oneColumnBreakpoint,
		SMALL: 0
	}) || { breakpoint: 'LARGE' };
	const shouldCollapseLeading =
		currentBreakpoint === 'SMALL' || (currentBreakpoint === 'MEDIUM' && bias === 'trailing');
	const shouldCollapseTrailing =
		currentBreakpoint === 'SMALL' || (currentBreakpoint === 'MEDIUM' && bias === 'leading');

	return (
		<div key="root" classes={[theme.variant(), fixedCss.root, classes.root]}>
			<div
				key="leading"
				classes={[classes.leading, shouldCollapseLeading && baseCss.visuallyHidden]}
			>
				{leading}
			</div>
			<div key="center" classes={[fixedCss.center, classes.center]}>
				{center}
			</div>
			<div
				key="trailing"
				classes={[classes.trailing, shouldCollapseTrailing && baseCss.visuallyHidden]}
			>
				{trailing}
			</div>
		</div>
	);
});

export default ThreeColumnLayout;
