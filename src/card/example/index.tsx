import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { tsx } from '@dojo/framework/widget-core/tsx';
import Card from '../index';
import Button from '../../button/index';

export class App extends WidgetBase {
	protected render() {
		return (
			<div>
				<h2>Card Examples</h2>
				<div id="example-1">
					<h3>Basic Card</h3>
					<Card>
						<p>Lorem ipsum</p>
					</Card>
				</div>
				<div id="example-2">
					<h3>Basic Card with Actions</h3>
					<Card
						actionsRenderer={() => (
							<Button onClick={() => console.log('action clicked.')}>Action</Button>
						)}
					>
						<p>Lorem ipsum</p>
					</Card>
				</div>
			</div>
		);
	}
}

export default App;
