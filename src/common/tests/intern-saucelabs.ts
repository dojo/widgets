export * from './intern';

export const environments = [
	// { browserName: 'internet explorer', version: [ '11.0' ], platform: 'Windows 7' },
	// { browserName: 'MicrosoftEdge', platform: 'Windows 10' },
	// { browserName: 'firefox', platform: 'Windows 10' },
	// { browserName: 'chrome', platform: 'Windows 10' },
	// { browserName: 'safari', version: '9.0', platform: 'OS X 10.11' },
	// Android platforms currently failing travis as saucelabs is not returning within a reasonable time
	// { browserName: 'android', version: '5.1' }
	{ browserName: 'iphone', version: '9.3' }
];

/* SauceLabs supports more max concurrency */
export const maxConcurrency = 4;

export const tunnel = 'SauceLabsTunnel';
