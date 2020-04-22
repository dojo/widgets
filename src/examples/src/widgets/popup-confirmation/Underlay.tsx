import { create, tsx } from '@dojo/framework/core/vdom';
import PopupConfirmation from '@dojo/widgets/popup-confirmation';
import Example from '../../Example';

import * as css from './styles/Basic.m.css';

const factory = create();

export default factory(function Underlay() {
	return (
		<Example>
			<div classes={css.root}>
				<PopupConfirmation underlayVisible={true}>
					{{
						content: () => 'Are you sure you want to delete this?',
						trigger: 'Trigger With Underlay'
					}}
				</PopupConfirmation>
			</div>
		</Example>
	);
});
