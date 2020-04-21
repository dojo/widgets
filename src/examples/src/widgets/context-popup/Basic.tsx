import { create, tsx } from '@dojo/framework/core/vdom';
import ContextPopup from '@dojo/widgets/context-popup';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<ContextPopup>
				{{
					trigger: <div>This text has a context popup</div>,
					content: ({ close, shouldFocus }) => (
						<div
							focus={shouldFocus}
							tabIndex={0}
							onblur={close}
							styles={{ background: 'red', height: '100px', fontSize: '32px' }}
						>
							Hello from the context menu!
						</div>
					)
				}}
			</ContextPopup>
		</Example>
	);
});
