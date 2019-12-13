import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';

import * as cardCss from '../../../../theme/dojo/card.m.css';

const factory = create();

export default factory(function Basic() {
	return (
		<div styles={{ width: '400px' }}>
			<Card>
				<h1 classes={cardCss.primary}>Hello, World</h1>
				<p classes={cardCss.secondary}>Lorem ipsum</p>
			</Card>
		</div>
	);
});
