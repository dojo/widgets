import { create, tsx } from '@dojo/framework/core/vdom';
import Menu from '@dojo/widgets/menu/Menu';

const factory = create();

export default factory(function Basic() {
	const animalOptions = [
		{ value: 'dog' },
		{ value: 'cat', label: 'Cat' },
		{ value: 'fish', disabled: true }
	];

	return (
		<Menu
			options={animalOptions}
			initialValue={'cat'}
			onValue={(value) => {
				console.log(`selected: ${value}`);
			}}
		/>
	);
});
