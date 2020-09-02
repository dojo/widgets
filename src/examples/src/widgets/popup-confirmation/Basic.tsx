import { create, tsx } from '@dojo/framework/core/vdom';
import PopupConfirmation from '@dojo/widgets/popup-confirmation';
import Example from '../../Example';

import * as css from './styles/Basic.m.css';
import Button from '@dojo/widgets/button';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div classes={css.root}>
				<PopupConfirmation onConfirm={() => {}} onCancel={() => {}}>
					{{
						content: 'Are you sure you want to delete this?',
						trigger: (open) => <Button onClick={open}>Trigger Below</Button>
					}}
				</PopupConfirmation>
				<PopupConfirmation onConfirm={() => {}} onCancel={() => {}} position="above">
					{{
						content: 'Are you sure you want to delete this?',
						trigger: (open) => <Button onClick={open}>Trigger Above</Button>
					}}
				</PopupConfirmation>
			</div>
		</Example>
	);
});
