import * as config from './config';
import { initConfig } from 'grunt-dojo2';

export = function (grunt: IGrunt) {
	require('load-grunt-tasks')(grunt);
	initConfig(grunt, config);

	grunt.registerTask('init:deploy', [
		'prompt:github',
		'setupDeploy'
	]);

	grunt.registerTask('dev', (grunt.config.get('devTasks') as string[]).concat([
		'copy:staticExampleFiles',
		'postcss:modules-dev',
		'copy:devStyles',
		'copy:devFonts'
	]));

	grunt.registerTask('dist', (grunt.config.get('distTasks') as string[]).concat([
		'postcss:modules-dist',
		'postcss:variables',
		'copy:distStyles',
		'copy:distFonts'
	]));

	grunt.registerTask('cd', [
		'release',
		'copy:showcase-modules',
		'copy:showcase-widgets',
		'exec:install-showcase-widgets',
		'exec:build-showcase',
		'prebuild',
		'sync:gh-pages',
		'clean:repo',
		'copy:gh-pages',
		'publish:gh-pages'
	]);
};
