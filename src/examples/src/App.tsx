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
import configs from './config';

const factory = create({ block });

function getWidgetName(config: any) {
	return Object.keys(config).reduce((newConfig, widget) => {
		return { ...newConfig, [widget]: config[widget].filename };
	}, {});
}

export default factory(function App({ middleware: { block } }) {
	const widgets = Object.keys(configs);
	const isDoc = has('docs') === 'false' ? false : has('docs');
	const a = isDoc ? block(readme)() : {};
	const contents = isDoc ? block(code)() : {};
	const widgetProperties = isDoc ? block(getWidgetProperties)(getWidgetName(configs)) : {};
	const themeProperties = isDoc ? block(getTheme)() : {};
	console.log(themeProperties);
	return (
		<div classes={[css.root]}>
			<nav classes={css.nav}>
				<ul classes={css.menuList}>
					{widgets.map((widget) => {
						return (
							<li classes={css.menuItem}>
								<ActiveLink
									to="example"
									classes={css.menuLink}
									params={{ widget, example: 'basic' }}
									matchParams={{ widget }}
									activeClasses={[css.selected]}
								>
									{widget.replace('-', ' ')}
								</ActiveLink>
							</li>
						);
					})}
				</ul>
			</nav>
			<main classes={[css.main]}>
				<Outlet
					id="example"
					renderer={({ params }) => {
						const { widget, example: exampleName } = params;
						const widgetConfig = configs[widget];
						let usage: any = {};
						let readme = null;
						let content = null;
						if (exampleName === 'basic') {
							usage = widgetConfig.overview.example;
							readme = a[widget];
							content = contents[`${widget}/Basic.tsx`];
						} else {
							usage = widgetConfig.examples.find(
								(example) => example.filename.toLowerCase() === exampleName
							);
						}
						console.log(widget);
						const propertyInterface = widgetProperties[widget];
						const widgetTheme = themeProperties[widget];
						return (
							<virtual>
								<div key={widget} classes={css.menu}>
									<ul classes={css.columnMenuList}>
										<li classes={css.columnMenuItem}>
											<ActiveLink
												key="example"
												classes={css.columnMenuLink}
												to="example"
												params={{ widget, example: 'basic' }}
												activeClasses={[css.columnMenuLinkSelected]}
											>
												Basic
											</ActiveLink>
										</li>
										{widgetConfig.examples &&
											widgetConfig.examples.map((example) => {
												return (
													<li classes={css.columnMenuItem}>
														<ActiveLink
															key={example.filename}
															classes={css.columnMenuLink}
															to="example"
															params={{
																widget,
																example: example.filename.toLowerCase()
															}}
															activeClasses={[
																css.columnMenuLinkSelected
															]}
														>
															{example.filename
																.replace(/([A-Z])/g, ' $1')
																.trim()}
														</ActiveLink>
													</li>
												);
											})}
									</ul>
								</div>
								<div key={`${widget}-${usage.filename}`} classes={[css.content]}>
									{readme && <div innerHTML={readme} />}
									{readme && <h1>Basic Usage</h1>}
									<div>
										<pre classes={['language-ts']}>
											<code classes={['language-ts']} innerHTML={content} />
										</pre>
									</div>
									<div>
										<usage.module />
									</div>
									{readme && (
										<div>
											<table>
												<thead />
												<tbody>
													{propertyInterface.map((prop) => {
														return (
															<tr>
																<td>{prop.name}</td>
																<td>{prop.type}</td>
																<td>{prop.optional}</td>
																<td>{prop.description}</td>
															</tr>
														);
													})}
												</tbody>
											</table>
										</div>
									)}
									{readme && <ul>
										{widgetTheme.map((className) => <li>{`.${className}`}</li>)}
									</ul>}
								</div>
							</virtual>
						);
					}}
				/>
			</main>
		</div>
	);
});
