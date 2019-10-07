import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from './App.m.css';
import Menu from './Menu';

const factory = create();

export default factory(function App() {
    return (
        <div classes={[css.root]}>
        <div>
            <Menu/>
        </div>
        </div>
    );
});