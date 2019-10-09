import has from '@dojo/framework/core/has';
import { create, tsx } from '@dojo/framework/core/vdom';
import block from '@dojo/framework/core/middleware/block';
import Outlet from '@dojo/framework/routing/Outlet';
import ActiveLink from './ActiveLink';

import readme from './readme.block';
import getWidgetProperties from './properties.block';
import getTheme from './theme.block';
import code from './code.block';
import * as css from './App.m.css';
import configs, { getWidgetFileNames } from './config';
import Menu from './Menu';
import SideMenu from './SideMenu';
import ExampleCode from './ExampleCode';
import ThemeTable from './ThemeTable';
import PropertyTable from './PropertyTable';

const widgetFilenames = getWidgetFileNames(configs);

interface AppProperties {
	includeDocs: boolean;
}

const factory = create({ block }).properties<AppProperties>();

export default factory(function App({ properties, middleware: { block } }) {
	const { includeDocs } = properties();
	const widgets = Object.keys(configs);
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
							<div key={widgetPath}>
								<SideMenu name={widgetName} config={widgetConfig} />
								<div classes={[css.content]}>
									{isBasic && <div innerHTML={readmeContent} />}
									{isBasic && <h1>Basic Usage</h1>}
									<div>
										<example.module />
									</div>
									{content && <ExampleCode content={content} />}
									{isBasic && <PropertyTable props={propertyInterface} />}
									{isBasic && <ThemeTable themes={themeClasses} />}
								</div>
							</div>
						);
					}}
				/>
			</main>
		</div>
	);
});
