import { create, tsx, renderer } from '@dojo/framework/core/vdom';

const factory = create();

const App = factory(function App() {
    return <div>examples</div>;
});

const r = renderer(() => <App />);
r.mount();