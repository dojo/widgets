import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import breakpoint from '@dojo/framework/core/middleware/breakpoint';
import theme from '../middleware/theme';
import * as fixedCss from './styles/three-column-layout.m.css';
import * as baseCss from '../common/styles/base.m.css';
import * as css from '../theme/default/three-column-layout.m.css';

export interface ThreeColumnLayoutProperties {
	twoColumnBreakpoint?: number;
	oneColumnBreakpoint?: number;
	bias?: 'leading' | 'trailing';
}

export interface ThreeColumnLayoutChildren {
	leading: RenderResult;
	trailing: RenderResult;
	center: RenderResult;
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
		<div classes={[theme.variant(), fixedCss.root, classes.root]}>
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
