import { create, tsx } from '@dojo/framework/core/vdom';
import Menu from '@dojo/widgets/menu/Menu';
import states from './states';

const factory = create();

export default factory(function ItemRenderer() {
	return (
		<Menu
			options={states}
			initialValue={'cat'}
			onValue={(value) => {
				console.log(`selected: ${value}`);
			}}
			itemRenderer={({ value }) => {
				const color = value.length > 7 ? 'red' : 'blue';
				return <div styles={{ color: color }}>{value}</div>;
			}}
			numberInView={8}
		/>
	);
});
