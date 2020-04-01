import Rate from '@dojo/widgets/rate';
import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';
import Icon from '@dojo/widgets/icon';

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
			>
				{(fill, integer, selected, over) => {
					const styles: Partial<CSSStyleDeclaration> = {
						borderBottom: `1px solid ${selected === integer ? '#369' : 'transparent'}`,
						background: over === integer ? '#ccc' : 'transparent'
					};
					return (
						<div styles={styles}>
							{fill ? <Icon type="upIcon" /> : <Icon type="downIcon" />}
						</div>
					);
				}}
			</Rate>
			<pre>{`${get('character')}`}</pre>
			<Rate
				name="emoji"
				steps={4}
				initialValue={3.5}
				onValue={(value) => {
					set('emoji', value);
				}}
			>
				{(fill, integer, selected, over) => {
					let moon = '🌑';
					const active = over !== undefined ? over : selected;
					if (active) {
						if (Math.ceil(active) === integer) {
							switch (Math.round((active % 1) * 4)) {
								case 0:
									moon = '🌕';
									break;
								case 1:
									moon = '🌘';
									break;
								case 2:
									moon = '🌗';
									break;
								case 3:
									moon = '🌖';
									break;
							}
						} else if (active > integer) {
							moon = '🌕';
						}
					}
					return <div>{moon}</div>;
				}}
			</Rate>
			<pre>{`${get('emoji')}`}</pre>
		</virtual>
	);
});

export default App;
