import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { tsx } from '@dojo/framework/widget-core/tsx';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import Card from '../index';
import * as cardCss from './../../theme/card.m.css';
import Button from '../../button/index';
import Icon from '../../icon/index';

export class App extends WidgetBase {
	protected render(): DNode {
		return (
			<div>
				<h2>Card Examples</h2>
				<div id="example-1">
					<h3>Basic Card</h3>
					<div styles={{ width: '400px' }}>
						<Card>
							<h1 classes={cardCss.primary}>Hello, World</h1>
							<p classes={cardCss.secondary}>Lorem ipsum</p>
						</Card>
					</div>
				</div>
				<div id="example-2">
					<h3>Basic Card with Action Buttons</h3>
					<div styles={{ width: '400px' }}>
						<Card
							actionsRenderer={() => (
								<div classes={cardCss.actionButtons}>
									<Button onClick={() => console.log('action clicked.')}>
										Action
									</Button>
								</div>
							)}
						>
							<h1 classes={cardCss.primary}>Hello, World</h1>
							<p classes={cardCss.secondary}>Lorem ipsum</p>
						</Card>
					</div>
				</div>
				<div id="example-3">
					<h3>Basic Card with Action Icons</h3>
					<div styles={{ width: '400px' }}>
						<Card
							actionsRenderer={() => (
								<div classes={cardCss.actionIcons}>
									<Icon type="secureIcon" />
									<Icon type="downIcon" />
									<Icon type="upIcon" />
								</div>
							)}
						>
							<h1 classes={cardCss.primary}>Hello, World</h1>
							<p classes={cardCss.secondary}>Lorem ipsum</p>
						</Card>
					</div>
				</div>
				<div id="example-4">
					<h3>Basic Card with Actions and Icons</h3>
					<div styles={{ width: '400px' }}>
						<Card
							actionsRenderer={() => [
								<div classes={cardCss.actionButtons}>
									<Button onClick={() => console.log('action clicked.')}>
										Action
									</Button>
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
				</div>
				<div id="example-5">
					<h3>Basic card with 16x9 Media</h3>
					<div styles={{ width: '400px' }}>
						<Card>
							<div
								classes={[cardCss.media, cardCss.media16by9]}
								styles={{
									background:
										'linear-gradient(to bottom, #1e5799 0%,#2989d8 100%,#207cca 51%,#7db9e8 100%)'
								}}
							/>
							<p classes={cardCss.secondary}>Lorem ipsum</p>
						</Card>
					</div>
				</div>
				<div id="example-6">
					<h3>Basic card with Square Media</h3>
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
				</div>
				<div id="example-7">
					<h3>Basic card with Content Media</h3>
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
				</div>
			</div>
		);
	}
}

export default App;
