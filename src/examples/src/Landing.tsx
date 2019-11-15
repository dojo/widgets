import { create, tsx } from '@dojo/framework/core/vdom';
import TextInput from '@dojo/widgets/text-input';
import icache from '@dojo/framework/core/middleware/icache';

import LinkedCard from './LinkedCard';
import { formatMenuItem } from './Menu';
import { Config } from './config';

import * as css from './Landing.m.css';
const githubImg = require('./images/github.svg');
const codesandboxImg = require('./images/codesandbox.png');

interface LandingProperties {
	widgets: string[];
	configs: Config;
}

const factory = create({ icache }).properties<LandingProperties>();

export default factory(function Landing({ properties, middleware: { icache } }) {
	const { widgets, configs } = properties();

	const filteredWidgets = icache.getOrSet('widgets', widgets);

	return (
		<div classes={css.root}>
			<h1 classes={css.header}>Dojo Widgets</h1>

			<section classes={css.container}>
				<TextInput
					placeholder={'Search for a widget...'}
					classes={{
						'@dojo/widgets/text-input': {
							input: [css.search],
							inputWrapper: [css.searchWrapperOverwide],
							root: [css.searchWrapper]
						}
					}}
					value={icache.get('search')}
					onValue={(value) => {
						console.log(value, typeof value);

						if (value) {
							icache.set(
								'widgets',
								widgets.filter((widget) => {
									return widget.toLowerCase().includes(value.toLowerCase());
								})
							);
							icache.set('search', value);
						} else {
							icache.set('widgets', widgets);
						}
					}}
				/>

				<div classes={css.grid}>
					{filteredWidgets.length ? (
						filteredWidgets.map((widget) => {
							const example = configs[widget];
							return (
								<div key={widget} classes={css.card}>
									<LinkedCard
										footer={
											<div classes={css.footer}>
												{example && example.filename ? (
													<a
														href={`https://codesandbox.io/s/github/dojo/widgets/tree/master/src/examples?fontsize=14&initialpath=%23%2Fwidget%2F${widget}%2F${example.filename.toLowerCase()}&module=%2Fsrc%2Fwidgets%2F${widget}%2F${
															example.filename
														}.tsx`}
														target="_blank"
														rel="noopener noreferrer"
														classes={css.linkBtn}
													>
														<img
															title="CodeSandbox"
															alt="CodeSandbox"
															height="24px"
															src={codesandboxImg}
														/>
													</a>
												) : null}
												<a
													href={`https://github.com/dojo/widgets/tree/master/src/${widget}`}
													target="_blank"
													rel="noopener noreferrer"
													classes={css.linkBtn}
												>
													<img
														title="GitHub"
														alt="GitHub"
														height="24px"
														src={githubImg}
													/>
												</a>
											</div>
										}
										params={{ widget: widget, example: 'basic' }}
										outlet="example"
									>
										<h4 classes={css.title}>{formatMenuItem(widget)}</h4>
									</LinkedCard>
								</div>
							);
						})
					) : (
						<div>No widgets found for that search term</div>
					)}
				</div>
			</section>
		</div>
	);
});
