import { create, tsx } from '@dojo/framework/core/vdom';
import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '../middleware/theme';
import * as fixedCss from './styles/two-column-layout.m.css';
import * as css from '../theme/default/two-column-layout.m.css';
import * as baseCss from '../common/styles/base.m.css';
import breakpoint from '@dojo/framework/core/middleware/breakpoint';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import resize from '@dojo/framework/core/middleware/resize';
import drag from '@dojo/framework/core/middleware/drag';

export interface TwoColumnLayoutProperties {
	/** Determines if the leading or trailing column should be larger, and which will be rendered if the layout collapses.
	 * If not set columns will be the same size and the leading column will be visible when collapsed
	 */
	bias?: 'leading' | 'trailing';
	/** Set the width at which the two column layout will collapse to a single column. Defaults to 600 pixels */
	breakpoint?: number;
	resize?: boolean;
}

export interface TwoColumnLayoutChildren {
	leading: RenderResult;
	trailing: RenderResult;
}

interface TwoColumnIcache {
	width?: number;
}
const icache = createICacheMiddleware<TwoColumnIcache>();
const factory = create({ theme, breakpoint, icache, resize, drag })
	.properties<TwoColumnLayoutProperties>()
	.children<TwoColumnLayoutChildren>();

export const TwoColumnLayout = factory(function({
	properties,
	children,
	middleware: { theme, breakpoint: breakpointMiddleware, icache, resize: resizeMiddleware, drag }
}) {
	const { bias, breakpoint = 600, resize } = properties();
	const { breakpoint: currentBreakpoint } = breakpointMiddleware.get('root', {
		SMALL: 0,
		LARGE: breakpoint
	}) || { breakpoint: 'LARGE' };
	const size = resizeMiddleware.get('leading');
	let width = resize && icache.get('width');
	const shouldCollapse = currentBreakpoint === 'SMALL';
	const thumbDrag = drag.get('divider');

	if (resize && thumbDrag.isDragging && size) {
		const currentWidth = typeof width === 'number' ? width : size.width;
		width = icache.set('width', thumbDrag.delta.x + currentWidth);
	} else if (
		resize &&
		!thumbDrag.isDragging &&
		typeof width === 'number' &&
		size &&
		size.width !== width
	) {
		width = icache.set('width', size.width);
	}

	const classes = theme.classes(css);
	const { leading, trailing } = children()[0];
	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				fixedCss.root,
				classes.root,
				typeof width === 'number' && fixedCss.resize
			]}
		>
			<div
				key="leading"
				classes={[
					bias === 'leading' && fixedCss.biased,
					bias === undefined && !shouldCollapse && fixedCss.even,
					bias === 'trailing' && shouldCollapse && baseCss.visuallyHidden,
					bias === 'trailing' && !shouldCollapse && classes.small,
					classes.column
				]}
				styles={typeof width === 'number' ? { flexBasis: `${width}px` } : {}}
			>
				{leading}
			</div>
			{resize && !shouldCollapse && <div classes={classes.divider} key="divider" />}
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
