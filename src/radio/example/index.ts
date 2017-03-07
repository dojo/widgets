import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { v, w } from '@dojo/widget-core/d';
import Radio from '../../radio/Radio';

const AppBase = StatefulMixin(WidgetBase);
export class App extends AppBase<WidgetProperties> {
	onChange(event: Event) {
		const value = (<HTMLInputElement> event.target).value;
		this.setState({ inputValue: value });
	}

	render() {
		const {
			inputValue = 'first'
		} = this.state;

		return v('div', [
			v('fieldset', {}, [
				v('legend', {}, ['Set of radio buttons with first option selected']),
				w(Radio, {
					key: 'r1',
					checked: inputValue === 'first',
					value: 'first',
					label: 'First option',
					name: 'sample-radios',
					onChange: this.onChange
				}),
				w(Radio, {
					key: 'r2',
					checked: inputValue === 'second',
					value: 'second',
					label: 'Second option',
					name: 'sample-radios',
					onChange: this.onChange
				}),
				w(Radio, {
					key: 'r3',
					checked: inputValue === 'third',
					value: 'third',
					label: 'Third option',
					name: 'sample-radios',
					onChange: this.onChange
				})
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
