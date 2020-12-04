import theme from '../middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';
import * as css from '../theme/default/helper-text.m.css';

export interface HelperTextProperties {
	/** The supplied helper text */
	text?: string;
	/** If `HelperText` indicates a valid condition */
	valid?: boolean;
}

const factory = create({ theme }).properties<HelperTextProperties>();

export default factory(function HelperText({ properties, middleware: { theme } }) {
	const { text, valid } = properties();
	const themedCss = theme.classes(css);

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				themedCss.root,
				valid === true ? themedCss.valid : null,
				valid === false ? themedCss.invalid : null
			]}
		>
			{text && (
				<p key="text" classes={themedCss.text} aria-hidden={'true'} title={text}>
					{text}
				</p>
			)}
		</div>
	);
});
