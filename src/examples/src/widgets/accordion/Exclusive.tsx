import Accordion, { Pane } from '@dojo/widgets/accordion';
import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<Accordion exclusive>
				{(onOpen, onClose, open) => {
					return [
						<Pane
							key="foo"
							onOpen={onOpen('foo')}
							onClose={onClose('foo')}
							open={open('foo')}
						>
							{{
								title: 'Pane 1',
								content: (
									<div>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit.
										Quisque id purus ipsum. Aenean ac purus purus. Nam
										sollicitudin varius augue, sed lacinia felis tempor in.
									</div>
								)
							}}
						</Pane>,
						<Pane
							key="bar"
							onOpen={onOpen('bar')}
							onClose={onClose('bar')}
							open={open('bar')}
						>
							{{
								title: 'Pane 2',
								content: (
									<div>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit.
										Quisque id purus ipsum. Aenean ac purus purus. Nam
										sollicitudin varius augue, sed lacinia felis tempor in.
									</div>
								)
							}}
						</Pane>,
						<Pane
							key="baz"
							onOpen={onOpen('baz')}
							onClose={onClose('baz')}
							open={open('baz')}
						>
							{{
								title: 'Pane 3',
								content: (
									<div>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit.
										Quisque id purus ipsum. Aenean ac purus purus. Nam
										sollicitudin varius augue, sed lacinia felis tempor in.
									</div>
								)
							}}
						</Pane>
					];
				}}
			</Accordion>
		</Example>
	);
});
