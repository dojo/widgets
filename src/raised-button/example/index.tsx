import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { tsx } from '@dojo/framework/widget-core/tsx';
import RaisedButton from '../../raised-button/index';

export default class App extends WidgetBase {
	private _buttonPressed: boolean | undefined;

	toggleButton() {
		this._buttonPressed = !this._buttonPressed;
		this.invalidate();
	}

	render() {
		return (
			<div>
				<h2>Raised Button Examples</h2>
				<div id="example-1">
					<p>Basic example:</p>
					<RaisedButton key="b1">Basic RaisedButton</RaisedButton>
				</div>
				<div id="example-2">
					<p>Disabled submit button:</p>
					<RaisedButton key="b2" disabled={true} type="submit">
						Submit
					</RaisedButton>
				</div>
				<div id="example-3">
					<p>Popup button:</p>
					<RaisedButton key="b3" popup={{ expanded: false, id: 'fakeId' }}>
						Open
					</RaisedButton>
					<div id="fakeId" />
				</div>
				<div id="example-4">
					<p>Toggle Button:</p>
					<RaisedButton
						key="b4"
						pressed={this._buttonPressed}
						onClick={this.toggleButton}
					>
						RaisedButton state
					</RaisedButton>
				</div>
			</div>
		);
	}
}
