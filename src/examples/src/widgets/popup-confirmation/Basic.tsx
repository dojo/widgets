import { create, tsx } from '@dojo/framework/core/vdom';
import PopupConfirmation from '@dojo/widgets/popup-confirmation';
import Example from '../../Example';

import * as css from './styles/Basic.m.css';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div classes={[css.root, css.vcenter]}>
				<PopupConfirmation>
					{{
						content: () => 'Are you sure you want to delete this?',
						trigger: 'Trigger Below'
					}}
				</PopupConfirmation>
				<PopupConfirmation position="above">
					{{
						content: () => 'Are you sure you want to delete this?',
						trigger: 'Trigger Above'
					}}
				</PopupConfirmation>
			</div>
		</Example>
	);
});
