import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Popup from '@dojo/widgets/popup';
import Menu from '@dojo/widgets/menu';
import Button from '@dojo/widgets/button';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const options = [
		{ value: 'Save' },
		{ value: 'copy', label: 'Copy' },
		{ value: 'Paste', disabled: true }
	];

	return (
		<Popup position="below">
			{{
				trigger: (onToggleOpen) => <Button onClick={onToggleOpen}>click me</Button>,
				content: (onClose) => <Menu options={options} onValue={onClose} />
			}}
		</Popup>
	);
});
