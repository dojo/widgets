import { create, tsx } from '@dojo/framework/core/vdom';
import Menu from '@dojo/widgets/menu';
import icache from '@dojo/framework/core/middleware/icache';
import * as menuThemeCss from './menuTheme.m.css';
// import * as itemThemeCss from './itemTheme.m.css';

const factory = create({ icache });

const theme = {
	'@dojo/widgets/menu': menuThemeCss
	// '@dojo/widgets/menu-item': itemThemeCss
};

export default factory(function Basic({ middleware: { icache } }) {
	const animalOptions = [
		{ value: 'dog' },
		{ value: 'cat', label: 'Cat' },
		{ value: 'fish', disabled: true }
	];

	return (
		<virtual>
			<Menu
				options={animalOptions}
				initialValue={'cat'}
				onValue={(value) => {
					icache.set('value', value);
				}}
				theme={theme}
				classes={
					{
						// '@dojo/widgets/menu': { itemRoot: [ itemThemeCss.itemRoot ] }
					}
				}
			/>
			<p>{`Selected: ${icache.getOrSet('value', '')}`}</p>{' '}
		</virtual>
	);
});
