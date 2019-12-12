import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';

import * as cardCss from '../../../../theme/dojo/card.m.css';

const factory = create();

export default factory(function CardWithMediaSquare() {
	return (
		<div styles={{ width: '200px' }}>
			<Card>
				<div
					classes={[cardCss.media, cardCss.mediaSquare]}
					styles={{
						background:
							'linear-gradient(to bottom, #1e5799 0%,#2989d8 100%,#207cca 51%,#7db9e8 100%)'
					}}
				/>
				<h1 classes={cardCss.primary}>Hello, World</h1>
				<p classes={cardCss.secondary}>Lorem ipsum</p>
			</Card>
		</div>
	);
});
