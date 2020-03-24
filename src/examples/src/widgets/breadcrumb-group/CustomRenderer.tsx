import { create, tsx } from '@dojo/framework/core/vdom';
import Breadcrumb from '@dojo/widgets/breadcrumb';
import BreadcrumbGroup from '@dojo/widgets/breadcrumb-group';
import Icon from '@dojo/widgets/icon';

import * as css from './CustomRenderer.m.css';

const factory = create();

const App = factory(function() {
	const items = [
		{ completed: true, key: 'step1', label: 'Step 1' },
		{ completed: true, key: 'step2', label: 'Step 2' },
		{ completed: false, current: true, key: 'step3', label: 'Step 3' },
		{ completed: false, key: 'step4', label: 'Step 4' }
	];

	return (
		<BreadcrumbGroup label="breadcrumb" items={items}>
			{(items) => (
				<ol classes={css.breadcrumb}>
					{items.map((item, i) => (
						<virtual>
							{i !== 0 && (
								<li
									classes={css.crumb}
									key={`${item.key}-separator`}
									aria-hidden="true"
								>
									<Icon type="rightIcon" />
								</li>
							)}
							<li classes={css.crumb} key={item.key}>
								{item.completed && (
									<Icon
										classes={{ '@dojo/widgets/icon': { icon: [css.icon] } }}
										type="checkIcon"
									/>
								)}

								<Breadcrumb
									classes={{
										'@dojo/widgets/breadcrumb': {
											root: [item.current ? css.current : undefined]
										}
									}}
									current={item.current ? 'step' : undefined}
									href={item.href}
									label={item.label}
									title={item.title}
								/>
							</li>
						</virtual>
					))}
				</ol>
			)}
		</BreadcrumbGroup>
	);
});

export default App;
