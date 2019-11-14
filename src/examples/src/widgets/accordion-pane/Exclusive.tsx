import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

import AccordionPane from '@dojo/widgets/accordion-pane';
import TitlePane from '@dojo/widgets/title-pane';

const factory = create({ icache });

export default factory(function Exclusive({ middleware: { icache } }) {
	let exclusiveKey = icache.getOrSet('exclusiveKey', undefined);
	return (
		<AccordionPane
			onRequestClose={(key) => {
				icache.set('exclusiveKey', undefined);
			}}
			onRequestOpen={(key) => {
				icache.set('exclusiveKey', key);
			}}
			openKeys={exclusiveKey ? [exclusiveKey] : []}
		>
			<TitlePane key="baz" title="Pane 1">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sodales ante sed
				massa finibus, at euismod ex molestie. Donec sagittis ligula at lorem blandit
				imperdiet. Aenean sapien justo, blandit at aliquet a, tincidunt ac nulla. Donec quis
				dapibus est. Donec id massa eu nisl cursus ornare quis sit amet velit.
			</TitlePane>
			<TitlePane key="bax" title="Pane 2">
				Ut non lectus vitae eros hendrerit pellentesque. In rhoncus ut lectus id tempus.
				Cras eget mauris scelerisque, condimentum ante sed, vehicula tellus. Donec congue
				ligula felis, a porta felis aliquet nec. Nulla mi lorem, efficitur nec lectus
				vehicula, vehicula varius eros.
			</TitlePane>
		</AccordionPane>
	);
});
