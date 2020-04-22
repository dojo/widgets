import Rate from '@dojo/widgets/rate';
import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';
import Icon from '@dojo/widgets/icon';
import * as css from './CustomCharacter.m.css';

const factory = create({ icache });

const App = factory(function({ properties, middleware: { icache } }) {
	const { get, set } = icache;
	icache.getOrSet('emoji', 3.5);

	return (
		<virtual>
			<Rate
				name="character"
				onValue={(value) => {
					set('character', value);
				}}
				classes={{
					'@dojo/widgets/rate': {
						root: [css.root],
						filled: [css.filled],
						empty: [css.empty],
						star: [css.star],
						selectedStar: [css.selectedStar]
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
					character: (fill, integer, selected, over) => {
						let moon = '🌑';
						const active = over !== undefined ? over : selected;
						if (active) {
							if (Math.ceil(active) === integer) {
								switch (Math.round((active % 1) * 2)) {
									case 0:
										moon = '🌕';
										break;
									case 1:
										moon = '🌗';
										break;
								}
							} else if (active > integer) {
								moon = '🌕';
							}
						}
						return <div classes={css.black}>{moon}</div>;
					}
				}}
			</Rate>
			<pre>{`${get('emoji')}`}</pre>
		</virtual>
	);
});

export default App;
