import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { tsx } from '@dojo/framework/core/vdom';
import RaisedButton from '../../raised-button/index';
import { DNode } from '@dojo/framework/core/interfaces';

export default class App extends WidgetBase {
	private _buttonPressed: boolean | undefined;

	toggleButton() {
		this._buttonPressed = !this._buttonPressed;
		this.invalidate();
	}

	render(): DNode {
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
