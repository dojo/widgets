const createProcessors = require('grunt-dojo2/tasks/util/postcss').createProcessors;

const cloneDirectory = '.sync';
const fontFiles = [ 'common/styles/fonts/*.{svg,ttf,woff}', 'themes/dojo/fonts/*.{svg,ttf,woff}' ];
const staticExampleFiles = [ '*/example/**', '!*/example/**/*.js' ];
const staticTestFiles = '*/tests/**/*.{html,css,json,xml,js,txt}';

export const copy = {
	'staticDefinitionFiles-dev': {
		cwd: 'src',
		src: [ '<%= staticDefinitionFiles %>' ],
		dest: '<%= devDirectory %>'
	},
	staticTestFiles: {
		expand: true,
		cwd: 'src',
		src: [ staticTestFiles ],
		dest: '<%= devDirectory %>'
	},
	staticExampleFiles: {
		expand: true,
		cwd: 'src',
		src: staticExampleFiles,
		dest: '<%= devDirectory %>'
	},
	devFonts: {
		expand: true,
		cwd: 'src',
		src: fontFiles,
		dest: '<%= devDirectory %>'
	},
	distFonts: {
		expand: true,
		cwd: 'src',
		src: fontFiles,
		dest: '<%= distDirectory %>'
	},
	devStyles: {
		expand: true,
		cwd: 'src',
		src: ['**/widgets.css', '**/example.css'],
		dest: '<%= devDirectory %>'
	},
	distStyles: {
		expand: true,
		cwd: 'src',
		src: '**/widgets.css',
		dest: '<%= distDirectory %>'
	},
	'gh-pages': {
		expand: true,
		cwd: '.',
		src: [
			'index.html'
		],
		dest: '<%= cloneDirectory %>'
	}
};

export const postcss = {
	'modules-dev': {
		files: [{
			expand: true,
			src: ['**/*.m.css'],
			dest: '<%= devDirectory %>',
			cwd: 'src'
		}],
		options: {
			processors: createProcessors('_build/', 'src')
		}
	}
};

export const intern = {
	options: {
		runType: 'runner',
		config: '<%= devDirectory %>/common/tests/intern',
		reporters: [ 'Runner' ]
	},
	browserstack: {},
	saucelabs: {
		options: {
			config: '<%= devDirectory %>/common/tests/intern-saucelabs'
		}
	},
	remote: {},
	local: {
		options: {
			config: '<%= devDirectory %>/common/tests/intern-local',
		}
	}
};

export const typedoc = {
	options: {
		ignoreCompilerErrors: true // Remove this once compile errors are resolved
	}
};

export const prompt = {
	github: {
		options: {
			questions: [
				{
					config: 'github.username',
					type: 'input',
					message: 'Github username'
				},
				{
					config: 'github.password',
					type: 'password',
					message: 'Github password'
				}
			]
		}
	}
};

export const setupDeploy = {
	repo: {
		options: {
			repo: 'bitpshr/widgets'
		}
	}
};

export const clean = {
	repo: [ '<%= cloneDirectory %>/**/*', '!.git/**' ]
};
