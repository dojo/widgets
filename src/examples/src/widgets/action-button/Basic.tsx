import { create, tsx } from '@dojo/framework/core/vdom';
import ActionButton from '@dojo/widgets/action-button';
import * as css from './example.m.css';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div classes={css.root}>
				<div>Action Button that inherits theme CSS variables from it's parent</div>
				<ActionButton>Action Button</ActionButton>
			</div>
		</Example>
	);
});
