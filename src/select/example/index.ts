import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { v, w } from '@dojo/widget-core/d';
import Select from '../../select/Select';

interface SelectOptions {
	[key: string]: string;
}

export const AppBase = StatefulMixin(WidgetBase);
export class App extends AppBase<WidgetProperties> {
	_selectOptions: SelectOptions = {
		'option1': 'First Option',
		'option2': 'Second Option',
		'option3': 'Third Option',
		'option4': 'Fourth Option'
	};

	render() {
		const {
			value = 'option1'
		} = this.state;

		return v('div', [
			w(Select, {
				key: 'select1',
				label: 'Try changing me',
				options: this._selectOptions,
				value: <string> value,
				onChange: (event: any) => {
					console.log('changing value to', event.target.value);
					this.setState({ value: event.target.value });
				}
			}),
			v('p', {
				innerHTML: 'Result: ' + this._selectOptions[value]
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
