import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Button from '@dojo/widgets/button';
import Toolbar from '@dojo/widgets/toolbar';

const factory = create({ icache });

export default factory(function Collapsed({ middleware: { icache } }) {
	return (
		<div>
			<Toolbar heading="Heading" collapseWidth={10000}>
				<Button
					onClick={() => {
						icache.set('value', 'Clicked Option A');
					}}
				>
					Option A{' '}
				</Button>
				<Button
					onClick={() => {
						icache.set('value', 'Clicked Option B');
					}}
				>
					Option B
				</Button>
				<Button
					onClick={() => {
						icache.set('value', 'Clicked Option C');
					}}
				>
					Option C
				</Button>
			</Toolbar>
			<div>{icache.get('value')}</div>
		</div>
	);
});
