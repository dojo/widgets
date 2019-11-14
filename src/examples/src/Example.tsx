import { create, tsx } from '@dojo/framework/core/vdom';
import has from '@dojo/framework/core/has';
import icache from '@dojo/framework/core/middleware/icache';
import TabController from '@dojo/widgets/tab-controller';
import Tab from '@dojo/widgets/tab';

import * as css from './Example.m.css';

interface ExampleProperties {
	content?: string;
	widgetName: string;
}

const factory = create({ icache }).properties<ExampleProperties>();

export default factory(function Example({ children, properties, middleware: { icache } }) {
	const activeIndex = icache.getOrSet('active', 0);
	const { content, widgetName } = properties();
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
	if (has('dojo-debug')) {
		const testIndex = has('docs') ? 2 : 1;
		tabs.push(
			<Tab key="tests" label="Tests">
				<div classes={css.tab}>
					{icache.get('active') === testIndex && (
						<iframe
							classes={css.iframe}
							src={`./intern?config=intern.json&widget=${widgetName}`}
						/>
					)}
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
