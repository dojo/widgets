import { create, tsx } from '@dojo/framework/core/vdom';
import Breadcrumb from '@dojo/widgets/breadcrumb';
import Icon from '@dojo/widgets/icon';

import * as css from './CustomRenderer.m.css';

const factory = create();

const App = factory(function() {
	const items = [
		{ label: 'Home', href: '/' },
		{
			label: 'Overview',
			href: '/#widget/breadcrumb/overview',
			title: 'Breadcrumb Overview'
		},
		{
			label: 'Tests',
			href: '/#widget/breadcrumb/tests',
			title: 'Breadcrumb Tests'
		}
	];

	return (
		<Breadcrumb label="breadcrumb" current={1} items={items}>
			{(item, isCurrent) => (
				<a
					aria-current={isCurrent || undefined}
					classes={css.link}
					href={item.href}
					title={item.title}
				>
					<Icon
						classes={{ '@dojo/widgets/icon': { icon: [css.icon] } }}
						type="checkIcon"
					/>
					<span classes={css.linkText}>{item.label}</span>
				</a>
			)}
		</Breadcrumb>
	);
});

export default App;
