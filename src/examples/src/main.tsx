import renderer, { tsx } from '@dojo/framework/core/vdom';
import Registry from '@dojo/framework/core/Registry';
import { registerThemeInjector } from '@dojo/framework/core/mixins/Themed';
import dojo from '@dojo/themes/dojo';

import App from './App';

const registry = new Registry();
registerThemeInjector(dojo, registry);

const r = renderer(() => <App/>);
r.mount({ registry });
