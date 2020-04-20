import { create, tsx } from '@dojo/framework/core/vdom';
import PopupConfirmation from '@dojo/widgets/popup-confirmation';

import * as css from './styles/Basic.m.css';

const factory = create();

const Example = factory(function Example() {
	return (
		<div classes={css.root}>
			<PopupConfirmation underlayVisible={true}>
				{{
					content: () => 'Are you sure you want to delete this?',
					trigger: 'Trigger With Underlay'
				}}
			</PopupConfirmation>
		</div>
	);
});

export default Example;
