import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from './App.m.css';
import Menu from './Menu';

interface AppProperties {
    configs: any[];
}

const factory = create().properties<AppProperties>();

export default factory(function App({ properties }) {
    const { configs } = properties();
    const [ config ] = configs;
    return (
        <div classes={[css.root]}>
        <div>
            <Menu/>
        </div>
            <div>
            <div>
								<h1>{config.title}</h1>
								{config.description ? <h4>{config.description}</h4> : null}
								<config.example />
							</div>    
            </div>>
        </div>
    );
});