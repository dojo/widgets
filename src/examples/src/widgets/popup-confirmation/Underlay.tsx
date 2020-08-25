import { create, tsx } from '@dojo/framework/core/vdom';
import PopupConfirmation from '@dojo/widgets/popup-confirmation';
import Example from '../../Example';

import * as css from './styles/Basic.m.css';
import Button from '@dojo/widgets/button';

const factory = create();

export default factory(function Underlay() {
	return (
		<Example>
			<div classes={css.root}>
				<PopupConfirmation onConfirm={() => {}} onCancel={() => {}} underlayVisible={true}>
					{{
						content: 'Are you sure you want to delete this?',
						trigger: (open) => <Button onClick={open}>Trigger With Underlay</Button>
					}}
				</PopupConfirmation>
			</div>
		</Example>
	);
});
