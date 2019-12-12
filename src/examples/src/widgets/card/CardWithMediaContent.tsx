import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';

import * as cardCss from '../../../../theme/dojo/card.m.css';

const factory = create();

export default factory(function CardWithMediaContent() {
	return (
		<div styles={{ width: '400px' }}>
			<Card>
				<div
					classes={[cardCss.media, cardCss.media16by9]}
					styles={{
						background:
							'linear-gradient(to bottom, #1e5799 0%,#2989d8 100%,#207cca 51%,#7db9e8 100%)'
					}}
				>
					<div classes={cardCss.mediaContent}>
						<h2>Media Content</h2>
					</div>
				</div>
				<h1 classes={cardCss.primary}>Hello, World</h1>
				<p classes={cardCss.secondary}>Lorem ipsum</p>
			</Card>
		</div>
	);
});
