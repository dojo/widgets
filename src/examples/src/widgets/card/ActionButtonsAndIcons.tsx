import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';
import Button from '@dojo/widgets/Button';
import Icon from '@dojo/widgets/Icon';

import * as cardCss from '../../../../theme/card.m.css';

const factory = create();

export default factory(function ActionButtonsAndIcons() {
	return (
		<div styles={{ width: '400px' }}>
			<Card
				actionsRenderer={() => [
					<div classes={cardCss.actionButtons}>
						<Button onClick={() => console.log('action clicked.')}>Action</Button>
					</div>,
					<div classes={cardCss.actionButtons}>
						<Icon type="secureIcon" />
						<Icon type="downIcon" />
						<Icon type="upIcon" />
					</div>
				]}
			>
				<h1 classes={cardCss.primary}>Hello, World</h1>
				<p classes={cardCss.secondary}>Lorem ipsum</p>
			</Card>
		</div>
	);
});
