import { tsx, create } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TabContainer from '@dojo/widgets/tab-container';
import Select from '@dojo/widgets/select';
import Example from '../../Example';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import { ListOption } from '@dojo/widgets/list';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });
const options = [
	{ value: 'top', label: 'Top' },
	{ value: 'left', label: 'Left' },
	{ value: 'right', label: 'Right' },
	{ value: 'bottom', label: 'Bottom' }
];

const template = createMemoryResourceTemplate<ListOption>();

export default factory(function ButtonAlignment({ id, middleware: { icache, resource } }) {
	const alignButtons = icache.getOrSet('align', 'top');

	const tabs = [
		{ name: 'Tab One' },
		{ name: 'Tab Two' },
		{ name: 'Tab Three' },
		{ name: 'Tab Four' }
	];

	return (
		<Example>
			<div>
				<Select
					initialValue={alignButtons}
					resource={resource({ template, initOptions: { id, data: options } })}
					onValue={(value) => {
						icache.set('align', value);
					}}
				/>
				<TabContainer alignButtons={alignButtons} tabs={tabs}>
					<div key="tab0">Hello Tab One</div>
					<div key="tab1">Hello Tab Two</div>
					<div key="tab2">Hello Tab Three</div>
					<div key="tab3">Hello Tab Four</div>
				</TabContainer>
			</div>
		</Example>
	);
});
