import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import * as css from '../theme/default/avatar.m.css';

export interface AvatarProperties {
	variant?: 'square' | 'rounded' | 'circle';
	secondary?: boolean;
	src?: string;
	size?: 'small' | 'medium' | 'large';
	alt?: string;
}

const factory = create({ theme }).properties<AvatarProperties>();

export const Avatar = factory(function Avatar({ middleware: { theme }, properties, children }) {
	const themeCss = theme.classes(css);
	const { secondary, src, alt, variant = 'circle', size = 'medium' } = properties();
	return (
		<div
			key="root"
			role={src && 'image'}
			aria-label={alt}
			classes={[
				theme.variant(),
				themeCss.root,
				secondary ? themeCss.avatarColorSecondary : themeCss.avatarColor,
				themeCss[size],
				themeCss[variant]
			]}
			styles={
				src
					? {
							backgroundImage: `url(${src})`
					  }
					: {}
			}
		>
			{children()}
		</div>
	);
});

export default Avatar;
