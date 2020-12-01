import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import * as css from '../theme/default/avatar.m.css';

export interface AvatarProperties {
	/* defines the avatar type, defaults to circle */
	type?: 'square' | 'rounded' | 'circle';
	/* determines if secondary color scheme should be used */
	secondary?: boolean;
	/* Determines if avatar should be rendered as an outline */
	outline?: boolean;
	/* the image source used for this avatar */
	src?: string;
	/* size of the avatar, defaults to medium */
	size?: 'small' | 'medium' | 'large';
	/* alt text to be used for aria */
	alt?: string;
}

const factory = create({ theme }).properties<AvatarProperties>();

export const Avatar = factory(function Avatar({ middleware: { theme }, properties, children }) {
	const themeCss = theme.classes(css);
	const { secondary, outline, src, alt, type = 'circle', size = 'medium' } = properties();
	return (
		<div
			key="root"
			role={src && 'image'}
			aria-label={alt}
			classes={[
				theme.variant(),
				themeCss.root,
				secondary ? themeCss.avatarColorSecondary : themeCss.avatarColor,
				outline && themeCss.avatarOutline,
				themeCss[size],
				themeCss[type]
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
