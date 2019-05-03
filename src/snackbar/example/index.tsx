import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { tsx } from '@dojo/framework/widget-core/tsx';
import watch from '@dojo/framework/widget-core/decorators/watch';
import Snackbar from '../index';
import Button from '../../button/index';

export default class App extends WidgetBase {
	@watch()
	private _showSuccess = false;

	@watch()
	private _showError = false;

	@watch()
	private _showPlain = false;

	@watch()
	private _showAutoclose = false;

	render() {
		return (
			<div>
				<h2>Snackbar Examples</h2>
				<div id="example-plain">
					<h3>Snackbar</h3>
					<Button onClick={() => (this._showPlain = true)}>Show Plain Snackbar</Button>
					<Snackbar
						open={this._showPlain}
						onDismiss={() => (this._showPlain = false)}
						title="Test Snackbar"
					/>
				</div>
				<div id="example-success">
					<h3>Success Snackbar</h3>
					<Button onClick={() => (this._showSuccess = true)}>Show Success</Button>
					<Snackbar
						success={true}
						open={this._showSuccess}
						onDismiss={() => (this._showSuccess = false)}
						title="Test Snackbar Success"
					/>
				</div>
				<div id="example-error">
					<h3>Error Snackbar</h3>
					<Button onClick={() => (this._showError = true)}>Show Error</Button>
					<Snackbar
						success={false}
						open={this._showError}
						onDismiss={() => (this._showError = false)}
						title="Test Snackbar Error"
					/>
				</div>
				<div id="example-aurtoclose">
					<h3>Auto close Snackbar</h3>
					<Button
						onClick={() => {
							this._showAutoclose = true;
							setTimeout(() => {
								this._showAutoclose = false;
							}, 5000);
						}}
					>
						Show Snackbar
					</Button>
					<Snackbar
						success={true}
						open={this._showAutoclose}
						onDismiss={() => (this._showAutoclose = false)}
						title="Test Snackbar auto close"
					/>
				</div>
			</div>
		);
	}
}
