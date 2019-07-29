import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { tsx } from '@dojo/framework/core/vdom';
import watch from '@dojo/framework/core/decorators/watch';
import Snackbar from '../index';
import Button from '../../button/index';
import Icon from '../../icon';

export default class App extends WidgetBase {
	@watch()
	private _showSuccess = false;

	@watch()
	private _showLeading = false;

	@watch()
	private _showStacked = false;

	@watch()
	private _showError = false;

	@watch()
	private _showPlain = false;

	@watch()
	private _showAutoclose = false;

	private _timeoutHandle: any;

	render(): DNode {
		return (
			<div>
				<h2>Snackbar Examples</h2>
				<div id="example-plain">
					<h3>Snackbar</h3>
					<Button onClick={() => (this._showPlain = true)}>Show Plain Snackbar</Button>
					<Snackbar
						open={this._showPlain}
						messageRenderer={() => 'Test Snackbar'}
						actionsRenderer={() => (
							<Button onClick={() => (this._showPlain = false)}>Dismiss</Button>
						)}
					/>
				</div>
				<div id="example-success">
					<h3>Success Snackbar</h3>
					<Button onClick={() => (this._showSuccess = true)}>Show Success</Button>
					<Snackbar
						type="success"
						open={this._showSuccess}
						messageRenderer={() => 'Test Snackbar Success'}
						actionsRenderer={() => (
							<Button onClick={() => (this._showSuccess = false)}>X</Button>
						)}
					/>
				</div>
				<div id="example-error">
					<h3>Error Snackbar</h3>
					<Button onClick={() => (this._showError = true)}>Show Error</Button>
					<Snackbar
						type="error"
						open={this._showError}
						messageRenderer={() => 'Test Snackbar Error'}
						actionsRenderer={() => (
							<Button onClick={() => (this._showError = false)}>X</Button>
						)}
					/>
				</div>
				<div id="example-leading">
					<h3>Leading Snackbar</h3>
					<Button onClick={() => (this._showLeading = true)}>Show Leading</Button>
					<Snackbar
						leading={true}
						open={this._showLeading}
						messageRenderer={() => 'Test leading snackbar'}
						actionsRenderer={() => (
							<Button onClick={() => (this._showLeading = false)}>X</Button>
						)}
					/>
				</div>
				<div id="example-stacked">
					<h3>Stacked Snackbar</h3>
					<Button onClick={() => (this._showStacked = true)}>Show Stacked</Button>
					<Snackbar
						stacked={true}
						open={this._showStacked}
						messageRenderer={() => 'Test stacked Snackbar'}
						actionsRenderer={() => (
							<Button onClick={() => (this._showStacked = false)}>Close</Button>
						)}
					/>
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
						messageRenderer={() => 'Test Snackbar auto close'}
						actionsRenderer={() => [
							<Button onClick={() => clearTimeout(this._timeoutHandle)}>
								Clear Timeout
							</Button>,
							<Button onClick={() => (this._showAutoclose = false)}>Close</Button>
						]}
					/>
				</div>
				<div id="example-non-test-message">
					<h3>Snackbar</h3>
					<Button onClick={() => (this._showPlain = true)}>
						Show Non-Text Message Snackbar
					</Button>
					<Snackbar
						open={this._showPlain}
						messageRenderer={() => (
							<div>
								<Icon type="checkIcon" />
								Text to display
							</div>
						)}
						actionsRenderer={() => (
							<Button onClick={() => (this._showPlain = false)}>Dismiss</Button>
						)}
					/>
				</div>
				<div id="example-non-test-array-message">
					<h3>Snackbar</h3>
					<Button onClick={() => (this._showPlain = true)}>
						Show Non-Text Message Array Snackbar
					</Button>
					<Snackbar
						open={this._showPlain}
						messageRenderer={() => [
							<div>
								<Icon type="checkIcon" />
								Text to display
							</div>
						]}
						actionsRenderer={() => (
							<Button onClick={() => (this._showPlain = false)}>Dismiss</Button>
						)}
					/>
				</div>
			</div>
		);
	}
}
