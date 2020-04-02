import AccordionPane from '@dojo/widgets/accordion-pane';
import { create, tsx } from '@dojo/framework/core/vdom';

const factory = create();

export default factory(function Basic() {
	return (
		<AccordionPane>
			{(Pane) => {
				return [
					<Pane>
						{{
							title: () => 'Pane 1',
							content: () => (
								<div>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
									id purus ipsum. Aenean ac purus purus. Nam sollicitudin varius
									augue, sed lacinia felis tempor in.
								</div>
							)
						}}
					</Pane>,
					<Pane>
						{{
							title: () => 'Pane 2',
							content: () => (
								<div>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
									id purus ipsum. Aenean ac purus purus. Nam sollicitudin varius
									augue, sed lacinia felis tempor in.
								</div>
							)
						}}
					</Pane>,
					<Pane>
						{{
							title: () => 'Pane 3',
							content: () => (
								<div>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
									id purus ipsum. Aenean ac purus purus. Nam sollicitudin varius
									augue, sed lacinia felis tempor in.
								</div>
							)
						}}
					</Pane>
				];
			}}
		</AccordionPane>
	);
});
