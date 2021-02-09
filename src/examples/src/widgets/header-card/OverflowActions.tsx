import { create, tsx } from '@dojo/framework/core/vdom';
import HeaderCard from '@dojo/widgets/header-card';
import Avatar from '@dojo/widgets/avatar';
import Example from '../../Example';
import Button from '@dojo/widgets/button';
import Icon from '@dojo/widgets/icon';
import List, { MenuItem } from '@dojo/widgets/list';

import TriggerPopup from '@dojo/widgets/trigger-popup';

const factory = create();

export default factory(function HeaderActions({ id }) {
	return (
		<Example>
			<div styles={{ maxWidth: '400px' }}>
				<HeaderCard title="Hello, World" subtitle="Lorem ipsum">
					{{
						avatar: <Avatar>D</Avatar>,
						headerActions: (
							<TriggerPopup>
								{{
									trigger: (onToggleOpen) => (
										<Button onClick={onToggleOpen}>
											<Icon type="barsIcon" />
										</Button>
									),
									content: (onClose) => (
										<div styles={{ background: 'white' }}>
											<List
												menu
												onValue={onClose}
												resource={{
													id,
													idKey: 'value',
													data: [{ value: 'editIcon', label: 'Edit' }]
												}}
											>
												{({ value }, props) => {
													return (
														<MenuItem {...props}>
															<Icon type={value as any} />
														</MenuItem>
													);
												}}
											</List>
										</div>
									)
								}}
							</TriggerPopup>
						),
						content: <p styles={{ margin: '0' }}>Lorem ipsum</p>
					}}
				</HeaderCard>
			</div>
		</Example>
	);
});
