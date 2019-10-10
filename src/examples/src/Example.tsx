import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TabController from '@dojo/widgets/tab-controller';
import Tab from '@dojo/widgets/tab';

import * as css from './Example.m.css';

interface ExampleProperties {
	content?: string;
}

const factory = create({ icache }).properties<ExampleProperties>();

export default factory(function Example({ children, properties, middleware: { icache } }) {
	const activeIndex = icache.getOrSet('active', 0);
	const { content } = properties();
	const tabs = [
		<Tab key="example" label="Example">
			<div classes={css.tab}>{children()}</div>
		</Tab>
	];
	if (content) {
		tabs.push(
			<Tab key="code" label="Code">
				<div classes={css.tab}>
					<pre classes={['language-ts']}>
						<code classes={['language-ts']} innerHTML={content} />
					</pre>
				</div>
			</Tab>
		);
	}
	return (
		<TabController
			activeIndex={activeIndex}
			onRequestTabChange={(index) => {
				icache.set('active', index);
			}}
		>
			{tabs}
		</TabController>
	);
});
