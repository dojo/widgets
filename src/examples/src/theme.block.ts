import * as postcss from 'postcss';
import * as fs from 'fs';

interface ThemeInterface {
	[index: string]: { [index: string]: string };
}

export default function(config: { [index: string]: string }): ThemeInterface {
	return Object.keys(config).reduce((properties, widget) => {
		const root = postcss.parse(fs.readFileSync(`./src/theme/${widget}.m.css`));
		const classHash = {} as any;
		let comment = '';
		root.walk((node) => {
			if (node.type === 'comment') {
				comment = node.text;
				console.warn(node.text);
			}
			if (node.type === 'rule' && node.selector.match(/^\./)) {
				const selector = /^\.[a-zA-Z0-9]*/.exec(node.selector);
				if (selector && !classHash[selector[0]]) {
					classHash[selector[0]] = comment;
				}
				comment = '';
			}
		});
		return { ...properties, [widget]: classHash };
	}, {});
}
