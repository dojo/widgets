import { create, tsx } from '@dojo/framework/core/vdom';
import List, { ListItem } from '@dojo/widgets/list';
import Icon from '@dojo/widgets/icon';
import states from './states';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import Button from '@dojo/widgets/button';
import * as exampleCss from './ListItemRenderer.m.css';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });
const template = createResourceTemplate<typeof states[0]>('value');

export default factory(function ListItemRenderer({ id, middleware: { icache, resource } }) {
	const listItemClasses = { '@dojo/widgets/list-item': { height: [exampleCss.rowHeight] } };
	return (
		<Example>
			<List
				resource={resource({
					template: template({ id, data: states }),
					transform: { value: 'value', label: 'value' }
				})}
				onValue={(value) => {
					icache.set('value', value);
				}}
				itemsInView={8}
			>
				{({ value, label }, props) => {
					switch (value) {
						case 'Alabama':
						case 'Alaska':
						case 'Arizona':
						case 'Arkansas':
							return (
								<ListItem {...props} classes={listItemClasses}>
									{{
										leading: <Icon type="locationIcon" />,
										primary: label,
										trailing: value
									}}
								</ListItem>
							);
						case 'California':
						case 'Colorado':
						case 'Connecticut':
							return (
								<ListItem {...props} classes={listItemClasses}>
									{{
										leading: <Icon type="infoIcon" />,
										primary: label,
										trailing: (
											<Button
												onClick={() =>
													alert(
														`You clicked ${value}. This doesn't select it.`
													)
												}
												classes={{
													'@dojo/widgets/button': {
														root: [exampleCss.buttonStyles]
													}
												}}
											>
												{{
													icon: (
														<Icon
															type="alertIcon"
															altText="Alert"
															size="small"
														/>
													)
												}}
											</Button>
										)
									}}
								</ListItem>
							);
						case 'Delaware':
						case 'Florida':
							return (
								<ListItem {...props} classes={listItemClasses}>
									{{
										leading: ' ',
										primary: label,
										trailing: 'Inset'
									}}
								</ListItem>
							);
						default:
							return (
								<ListItem {...props} classes={listItemClasses}>
									{label}
								</ListItem>
							);
					}
				}}
			</List>
			<p>{`Clicked On: ${JSON.stringify(icache.getOrSet('value', ''))}`}</p>
		</Example>
	);
});
