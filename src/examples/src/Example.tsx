import { create, tsx } from '@dojo/framework/core/vdom';
import injector from '@dojo/framework/core/middleware/injector';
import Router from '@dojo/framework/routing/Router';
import has from '@dojo/framework/core/has';
import TabController from '@dojo/widgets/tab-controller';
import Tab from '@dojo/widgets/tab';

import * as css from './Example.m.css';

interface ExampleProperties {
	content?: string;
	widgetName: string;
	active: string;
}

const factory = create({ injector }).properties<ExampleProperties>();

export default factory(function Example({ children, properties, middleware: { injector } }) {
	const router = injector.get<Router>('router');
	const { content, widgetName, active } = properties();
	const tabNames = ['example'];

	if (content) {
		tabNames.push('code');
	}
	if (has('dojo-debug')) {
		tabNames.push('tests');
	}
	const activeTab = tabNames.indexOf(active) === -1 ? 0 : tabNames.indexOf(active);
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
		tabs.push(
			<Tab key="tests" label="Tests">
				<div classes={css.tab}>
					{activeTab === tabNames.indexOf('tests') && (
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
			activeIndex={activeTab}
			onRequestTabChange={(index) => {
				if (router) {
					const activeTab = tabNames[index];
					const href = router.link('example', { active: activeTab });
					href && router.setPath(href);
				}
			}}
		>
			{tabs}
		</TabController>
	);
});
