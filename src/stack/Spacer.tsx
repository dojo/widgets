import { create, diffProperty } from '@dojo/framework/core/vdom';
import './styles/spacer.m.css';

interface SpacerProperties {
	/** The number of columns/rows that the spacer should span, defaults to 1 */
	span?: number;
	/** callback used to return the span setting of the spacer */
	spanCallback?: (span: number) => void;
}

const factory = create({ diffProperty }).properties<SpacerProperties>();

export const Spacer = factory(function Spacer({
	children,
	middleware: { diffProperty },
	properties
}) {
	diffProperty('span', properties, (_, next) => {
		next.spanCallback && next.spanCallback(next.span || 1);
	});
	return children();
});

export default Spacer;
