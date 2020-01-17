import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Toolbar from '@dojo/widgets/toolbar';
import RaisedButton from '@dojo/widgets/raised-button';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<div>
			<Toolbar heading="Heading" collapseWidth={0}>
				<RaisedButton
					onClick={() => {
						icache.set('value', 'Clicked Option A');
					}}
				>
					Option A{' '}
				</RaisedButton>
				<RaisedButton
					onClick={() => {
						icache.set('value', 'Clicked Option B');
					}}
				>
					Option B
				</RaisedButton>
				<RaisedButton
					onClick={() => {
						icache.set('value', 'Clicked Option C');
					}}
				>
					Option C
				</RaisedButton>
			</Toolbar>
			<div>{icache.get('value')}</div>
		</div>
	);
});
