import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import { listOptions } from '../../data';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });
const template = createResourceTemplate<{ value: string; disabled?: boolean }>('value');

export default factory(function Controlled({ id, middleware: { icache, resource } }) {
	const activeIndex = icache.getOrSet('activeIndex', 0);

	return (
		<Example>
			<div>
				<button
					type="button"
					onclick={() => {
						icache.set(
							'activeIndex',
							(activeIndex - 1 + listOptions.length) % listOptions.length
						);
					}}
				>
					UP
				</button>
				<button
					type="button"
					onclick={() => {
						icache.set('activeIndex', (activeIndex + 1) % listOptions.length);
					}}
				>
					DOWN
				</button>
				<button
					type="button"
					onclick={() => {
						const activeIndex = icache.get<number>('activeIndex');
						if (activeIndex) {
							const item = listOptions[activeIndex];
							!item.disabled && icache.set('value', listOptions[activeIndex]);
						}
					}}
				>
					SELECT
				</button>
				<List
					focusable={false}
					itemsInView={4}
					resource={resource({
						template: template({ id, data: listOptions }),
						transform: { value: 'value', label: 'value' }
					})}
					onActiveIndexChange={(index: number) => {
						icache.set('activeIndex', index);
					}}
					activeIndex={activeIndex}
					value={icache.get('value')}
					onValue={(value) => {
						icache.set('value', value);
					}}
				/>
			</div>
			<p>{`Clicked on: ${JSON.stringify(icache.getOrSet('value', ''))}`}</p>
		</Example>
	);
});
