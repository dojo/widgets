import { create, tsx } from '@dojo/framework/core/vdom';
import block from '@dojo/framework/core/middleware/block';
import Outlet from '@dojo/framework/routing/Outlet';

import readme from './readme.block';
import getWidgetProperties, { PropertyInterface } from './properties.block';
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

interface Content {
	[index: string]: string;
}

export default factory(function App({ properties, middleware: { block } }) {
	const { includeDocs } = properties();
	const widgets = Object.keys(configs).sort();
	let widgetReadmeContent: Content = {};
	let widgetExampleContent: Content = {};
	let widgetProperties: { [index: string]: PropertyInterface[] } = {};
	let widgetThemeClasses: { [index: string]: string[] } = {};
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
						if (!example) {
							return null;
						}
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
									{includeDocs && (
										<a
											href={`https://codesandbox.io/s/github/dojo/widgets/tree/master/src/examples?fontsize=14&initialpath=%23%2Fwidget%2F${widgetName}%2F${example.filename.toLowerCase()}&module=%2Fsrc%2Fwidgets%2F${widgetName}%2F${
												example.filename
											}.tsx`}
										>
											<img
												alt={`Edit ${widgetPath} example`}
												src="https://codesandbox.io/static/img/play-codesandbox.svg"
											/>
										</a>
									)}
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
