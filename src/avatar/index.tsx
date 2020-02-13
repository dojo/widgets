import { create, tsx } from '@dojo/framework/core/vdom';
import theme, { ThemeProperties } from '../middleware/theme';
import * as css from '../theme/default/avatar.m.css';

export interface AvatarProperties extends ThemeProperties {
	variant?: 'square' | 'rounded' | 'circle';
	src?: string;
	size?: 'small' | 'medium' | 'large';
	alt?: string;
}

const factory = create({ theme }).properties<AvatarProperties>();

export const Avatar = factory(function Avatar({ middleware: { theme }, properties, children }) {
	const themeCss = theme.classes(css);
	const { src, alt, variant = 'circle', size = 'medium' } = properties();
	return (
		<div key="root" classes={[themeCss.root, themeCss[size], themeCss[variant]]}>
			{src ? <img alt={alt} classes={themeCss.image} src={src} /> : children()}
		</div>
	);
});

export default Avatar;
