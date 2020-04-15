import { create, tsx } from '@dojo/framework/core/vdom';
import { ButtonProperties } from '../button/index';

export interface FloatingActionButtonProperties extends ButtonProperties {}

const factory = create().properties<indexProperties>();

export default factory(function index({ properties }) {
	const x = properties();
	return <div />;
});
