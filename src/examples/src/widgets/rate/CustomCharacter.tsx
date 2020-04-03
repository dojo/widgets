import Rate from '@dojo/widgets/rate';
import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';
import Icon from '@dojo/widgets/icon';
import * as css from './CustomCharacter.m.css';

const factory = create({ icache });

const App = factory(function({ properties, middleware: { icache } }) {
	const { get, set } = icache;

	return (
		<virtual>
			<Rate
				name="character"
				onValue={(value) => {
					set('character', value);
				}}
				classes={{
					'@dojo/widgets/rate': {
						integer: [css.integer],
						selectedInteger: [css.selectedInteger],
						filled: [css.filled],
						empty: [css.empty]
					}
				}}
			>
				{{
					character: (filled) => (
						<span>{filled ? <Icon type="upIcon" /> : <Icon type="downIcon" />}</span>
					)
				}}
			</Rate>
			<pre>{`${get('character')}`}</pre>
			<Rate
				name="emoji"
				allowHalf
				initialValue={3.5}
				onValue={(value) => {
					set('emoji', value);
				}}
			>
				{{
					character: (filled) => {
						return <span styles={{ textAlign: 'center' }}>{filled ? '🌕' : '🌑'}</span>;
					}
				}}
			</Rate>
			<pre>{`${get('emoji')}`}</pre>
		</virtual>
	);
});

export default App;
