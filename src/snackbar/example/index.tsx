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

	private _timeoutHandle: any;

	render() {
		return (
			<div>
				<h2>Snackbar Examples</h2>
				<div id="example-plain">
					<h3>Snackbar</h3>
					<Button onClick={() => (this._showPlain = true)}>Show Plain Snackbar</Button>
					<Snackbar
						open={this._showPlain}
						message="Test Snackbar"
						actions={<Button onClick={() => (this._showPlain = false)}>Dismiss</Button>}
					/>
				</div>
				<div id="example-success">
					<h3>Success Snackbar</h3>
					<Button onClick={() => (this._showSuccess = true)}>Show Success</Button>
					<Snackbar
						type="success"
						open={this._showSuccess}
						message="Test Snackbar Success"
						actions={<Button onClick={() => (this._showSuccess = false)}>X</Button>}
					/>
				</div>
				<div id="example-error">
					<h3>Error Snackbar</h3>
					<Button onClick={() => (this._showError = true)}>Show Error</Button>
					<Snackbar type="error" open={this._showError} message="Test Snackbar Error" />
				</div>
				<div id="example-autoclose">
					<h3>Multiple Actions</h3>
					<Button
						onClick={() => {
							this._showAutoclose = true;
							this._timeoutHandle = setTimeout(() => {
								this._showAutoclose = false;
							}, 5000);
						}}
					>
						Show Snackbar
					</Button>
					<Snackbar
						type="success"
						open={this._showAutoclose}
						message="Test Snackbar auto close"
						actions={[
							<Button onClick={() => clearTimeout(this._timeoutHandle)}>
								Clear Timeout
							</Button>,
							<Button onClick={() => (this._showAutoclose = false)}>Close</Button>
						]}
					/>
				</div>
			</div>
		);
	}
}
