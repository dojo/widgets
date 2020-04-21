import Header from '@dojo/widgets/header';
import { Link } from '@dojo/framework/routing/Link';
import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<Header sticky>
				{{
					title: 'My App',
					actions: [
						<Link to="#foo">Foo</Link>,
						<Link to="#bar">Bar</Link>,
						<Link to="#baz">Baz</Link>
					]
				}}
			</Header>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua. Pellentesque pulvinar pellentesque
				habitant morbi tristique. Facilisis magna etiam tempor orci eu lobortis elementum
				nibh. Massa enim nec dui nunc mattis enim ut tellus elementum. Nunc sed velit
				dignissim sodales ut eu. Sit amet cursus sit amet dictum. Sem nulla pharetra diam
				sit amet nisl suscipit adipiscing. Eu consequat ac felis donec. Egestas egestas
				fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Nunc sed
				id semper risus in. Sit amet commodo nulla facilisi. Justo donec enim diam vulputate
				ut. Viverra ipsum nunc aliquet bibendum enim facilisis gravida. Odio eu feugiat
				pretium nibh ipsum consequat nisl. Ultricies mi eget mauris pharetra et ultrices.
				Cras adipiscing enim eu turpis egestas pretium aenean pharetra magna. Sed turpis
				tincidunt id aliquet. Accumsan sit amet nulla facilisi morbi tempus iaculis.
			</p>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua. Pellentesque pulvinar pellentesque
				habitant morbi tristique. Facilisis magna etiam tempor orci eu lobortis elementum
				nibh. Massa enim nec dui nunc mattis enim ut tellus elementum. Nunc sed velit
				dignissim sodales ut eu. Sit amet cursus sit amet dictum. Sem nulla pharetra diam
				sit amet nisl suscipit adipiscing. Eu consequat ac felis donec. Egestas egestas
				fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Nunc sed
				id semper risus in. Sit amet commodo nulla facilisi. Justo donec enim diam vulputate
				ut. Viverra ipsum nunc aliquet bibendum enim facilisis gravida. Odio eu feugiat
				pretium nibh ipsum consequat nisl. Ultricies mi eget mauris pharetra et ultrices.
				Cras adipiscing enim eu turpis egestas pretium aenean pharetra magna. Sed turpis
				tincidunt id aliquet. Accumsan sit amet nulla facilisi morbi tempus iaculis.
			</p>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
				incididunt ut labore et dolore magna aliqua. Pellentesque pulvinar pellentesque
				habitant morbi tristique. Facilisis magna etiam tempor orci eu lobortis elementum
				nibh. Massa enim nec dui nunc mattis enim ut tellus elementum. Nunc sed velit
				dignissim sodales ut eu. Sit amet cursus sit amet dictum. Sem nulla pharetra diam
				sit amet nisl suscipit adipiscing. Eu consequat ac felis donec. Egestas egestas
				fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Nunc sed
				id semper risus in. Sit amet commodo nulla facilisi. Justo donec enim diam vulputate
				ut. Viverra ipsum nunc aliquet bibendum enim facilisis gravida. Odio eu feugiat
				pretium nibh ipsum consequat nisl. Ultricies mi eget mauris pharetra et ultrices.
				Cras adipiscing enim eu turpis egestas pretium aenean pharetra magna. Sed turpis
				tincidunt id aliquet. Accumsan sit amet nulla facilisi morbi tempus iaculis.
			</p>
		</Example>
	);
});
