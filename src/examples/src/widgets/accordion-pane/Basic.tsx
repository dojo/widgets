import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

import AccordionPane from '@dojo/widgets/accordion-pane';
import TitlePane from '@dojo/widgets/title-pane';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	let openKeys = icache.getOrSet<string[]>('open', []);
	return (
		<AccordionPane
			onRequestClose={(key) => {
				const idx = openKeys.findIndex((k) => k === key);
				if (idx !== -1) {
					openKeys.splice(idx, 1);
				}
				icache.set('open', [...openKeys]);
			}}
			onRequestOpen={(key) => {
				const idx = openKeys.findIndex((k) => k === key);
				if (idx === -1) {
					openKeys = [...openKeys, key];
				}
				icache.set('open', openKeys);
			}}
			openKeys={openKeys}
		>
			<TitlePane key="foo" title="Pane 1">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sodales ante sed
				massa finibus, at euismod ex molestie. Donec sagittis ligula at lorem blandit
				imperdiet. Aenean sapien justo, blandit at aliquet a, tincidunt ac nulla. Donec quis
				dapibus est. Donec id massa eu nisl cursus ornare quis sit amet velit.
			</TitlePane>
			<TitlePane key="la" title="Pane 2">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sodales ante sed
				massa finibus, at euismod ex molestie. Donec sagittis ligula at lorem blandit
				imperdiet. Aenean sapien justo, blandit at aliquet a, tincidunt ac nulla. Donec quis
				dapibus est. Donec id massa eu nisl cursus ornare quis sit amet velit.
			</TitlePane>
			<TitlePane key="dee" title="Pane 3">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sodales ante sed
				massa finibus, at euismod ex molestie. Donec sagittis ligula at lorem blandit
				imperdiet. Aenean sapien justo, blandit at aliquet a, tincidunt ac nulla. Donec quis
				dapibus est. Donec id massa eu nisl cursus ornare quis sit amet velit.
			</TitlePane>
			<TitlePane key="bar" title="Pane 4">
				Ut non lectus vitae eros hendrerit pellentesque. In rhoncus ut lectus id tempus.
				Cras eget mauris scelerisque, condimentum ante sed, vehicula tellus. Donec congue
				ligula felis, a porta felis aliquet nec. Nulla mi lorem, efficitur nec lectus
				vehicula, vehicula varius eros.
			</TitlePane>
		</AccordionPane>
	);
});
