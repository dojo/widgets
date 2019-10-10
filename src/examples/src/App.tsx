import has from '@dojo/framework/core/has';
import { create, tsx } from '@dojo/framework/core/vdom';
import block from '@dojo/framework/core/middleware/block';
import Outlet from '@dojo/framework/routing/Outlet';
import ActiveLink from './ActiveLink';

import readme from './readme.block';
import getWidgetProperties from './properties.block';
import getTheme from './theme.block';
import code from './code.block';
import configs, { getWidgetFileNames } from './config';
import Menu from './Menu';
import SideMenu from './SideMenu';
import Example from './Example';
import ThemeTable from './ThemeTable';
import PropertyTable from './PropertyTable';

import * as css from './App.m.css';

const widgetFilenames = getWidgetFileNames(configs);

interface AppProperties {
	includeDocs: boolean;
}

const factory = create({ block }).properties<AppProperties>();

export default factory(function App({ properties, middleware: { block } }) {
	const { includeDocs } = properties();
	const widgets = Object.keys(configs).sort();
	let widgetReadmeContent = {};
	let widgetExampleContent = {};
	let widgetProperties = {};
	let widgetThemeClasses = {};
	if (includeDocs) {
		widgetReadmeContent = block(readme)() || {};
		widgetExampleContent = block(code)() || {};
		widgetProperties = block(getWidgetProperties)(widgetFilenames) || {};
		widgetThemeClasses = block(getTheme)(widgetFilenames) || {};
	}
	return (
		<div classes={[css.root]}>
			<Menu widgetNames={widgets} />
			<main classes={[css.main]}>
				<Outlet
					id="landing"
					renderer={() => {
						return <div>Widget Examples!</div>;
					}}
				/>
				<Outlet
					id="example"
					renderer={({ params }) => {
						const { widget: widgetName, example: exampleName } = params;
						const widgetConfig = configs[widgetName];
						const { overview, examples = [] } = widgetConfig;
						const isBasic = exampleName === 'basic';
						const readmeContent = widgetReadmeContent[widgetName];
						const example = isBasic
							? overview.example
							: examples.find(
									(example) => example.filename.toLowerCase() === exampleName
							  );
						const widgetPath = `${widgetName}/${example.filename}`;
						const content =
							widgetExampleContent[`${widgetPath}.tsx`] ||
							widgetExampleContent[`${widgetPath}.ts`];
						const propertyInterface = widgetProperties[widgetName];
						const themeClasses = widgetThemeClasses[widgetName];
						return (
							<virtual key={widgetPath}>
								<SideMenu name={widgetName} config={widgetConfig} />
								<div classes={[css.content]}>
									{isBasic && includeDocs && <div innerHTML={readmeContent} />}
									<h1>{isBasic ? 'Basic Usage' : example.title}</h1>
									<Example content={content}>
										<example.module />
									</Example>
									{isBasic && includeDocs && (
										<PropertyTable props={propertyInterface} />
									)}
									{isBasic && includeDocs && <ThemeTable themes={themeClasses} />}
								</div>
							</virtual>
						);
					}}
				/>
			</main>
		</div>
	);
});