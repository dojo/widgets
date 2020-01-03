import { create, tsx } from '@dojo/framework/core/vdom';
import ContextPopup from '@dojo/widgets/context-popup';

const factory = create();

export default factory(function Basic() {
	return (
		<virtual>
			<ContextPopup>
				{{
					trigger: () => <div>This text has a context popup</div>,
					content: (onClose, shouldFocus) => (
						<div
							focus={shouldFocus}
							tabIndex={0}
							onblur={onClose}
							styles={{ background: 'red', height: '100px', fontSize: '32px' }}
						>
							Hello from the context menu!
						</div>
					)
				}}
			</ContextPopup>
		</virtual>
	);
});
