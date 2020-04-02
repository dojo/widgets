import AccordionPane from '@dojo/widgets/accordion-pane';
import TitlePane from '@dojo/widgets/title-pane';
import { create, tsx } from '@dojo/framework/core/vdom';

const factory = create();

export default factory(function Basic() {
	return (
		<AccordionPane>
			{(onOpen, onClose, initialOpen, theme) => {
				return [
					<TitlePane
						key="foo"
						onOpen={onOpen('foo')}
						onClose={onClose('foo')}
						initialOpen={initialOpen('foo')}
						theme={theme}
					>
						{{
							title: 'Pane 1',
							content: (
								<div>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
									id purus ipsum. Aenean ac purus purus. Nam sollicitudin varius
									augue, sed lacinia felis tempor in.
								</div>
							)
						}}
					</TitlePane>,
					<TitlePane
						key="bar"
						onOpen={onOpen('bar')}
						onClose={onClose('bar')}
						initialOpen={initialOpen('bar')}
						theme={theme}
					>
						{{
							title: 'Pane 2',
							content: (
								<div>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
									id purus ipsum. Aenean ac purus purus. Nam sollicitudin varius
									augue, sed lacinia felis tempor in.
								</div>
							)
						}}
					</TitlePane>,
					<TitlePane
						key="baz"
						onOpen={onOpen('baz')}
						onClose={onClose('baz')}
						initialOpen={initialOpen('baz')}
						theme={theme}
					>
						{{
							title: 'Pane 3',
							content: (
								<div>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
									id purus ipsum. Aenean ac purus purus. Nam sollicitudin varius
									augue, sed lacinia felis tempor in.
								</div>
							)
						}}
					</TitlePane>
				];
			}}
		</AccordionPane>
	);
});
