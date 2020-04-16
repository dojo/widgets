import { create, tsx } from '@dojo/framework/core/vdom';
import { defaultTransform } from '@dojo/widgets/select';
import { createMemoryResourceWithDataAndFilter } from '../list/memoryTemplate';
import MultiSelectTypeahead from '@dojo/widgets/multi-select-typeahead';
import { ListItem } from '@dojo/widgets/list';

const factory = create();
const options = [
	{ value: 'apples', label: 'Apples' },
	{ value: 'tacos', label: 'Tacos' },
	{ value: 'pizza', label: 'Pizza' }
];

const resource = createMemoryResourceWithDataAndFilter(options);

export default factory(function CustomRenderer() {
	return (
		<virtual>
			<MultiSelectTypeahead resource={resource} transform={defaultTransform}>
				{{
					label: 'Favorite Foods',
					items: (item, props) => (
						<ListItem {...props}>
							{item.selected ? '❤️' : '🤢'} {item.label}
						</ListItem>
					),
					selected: (value) => {
						switch (value) {
							case 'apples':
								return '🍎';
							case 'tacos':
								return '🌮';
							case 'pizza':
								return '🍕';
						}
					}
				}}
			</MultiSelectTypeahead>
		</virtual>
	);
});
