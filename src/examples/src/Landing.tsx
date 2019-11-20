import { create, tsx } from '@dojo/framework/core/vdom';
import TextInput from '@dojo/widgets/text-input';
import icache from '@dojo/framework/core/middleware/icache';

import LinkedCard from './LinkedCard';
import { formatWidgetName } from './App';
import * as css from './Landing.m.css';

interface LandingProperties {
	widgets: string[];
}

const factory = create({ icache }).properties<LandingProperties>();

export default factory(function Landing({ properties, middleware: { icache } }) {
	const { widgets } = properties();

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
							inputWrapper: [css.searchWrapper],
							root: [css.searchRoot]
						}
					}}
					value={icache.get('search')}
					onValue={(value) => {
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
							return (
								<div key={widget} classes={css.card}>
									<LinkedCard
										params={{
											widget: widget,
											example: 'basic',
											active: 'example'
										}}
										outlet="example"
									>
										<h4 classes={css.title}>{formatWidgetName(widget)}</h4>
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
