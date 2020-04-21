import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import * as css from './Example.m.css';

const factory = create({ theme });

export default factory(function({ children, middleware: { theme } }) {
	const [example, ...rest] = children();
	return (
		<virtual>
			<div classes={[css.root, theme.variant()]}>{example}</div>
			{...rest}
		</virtual>
	);
});
