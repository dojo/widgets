const { describe, it, beforeEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
import coreTheme from '@dojo/framework/core/middleware/theme';
import { sandbox } from 'sinon';
import icacheMiddleware from '@dojo/framework/core/middleware/icache';
import theme from '../theme';
import ThemeInjector from '@dojo/framework/core/ThemeInjector';

const sb = sandbox.create();
const invalidator = sb.stub();
const diffProperty = sb.stub();
const getStub = sb.stub();
const injector = {
	subscribe: sb.stub(),
	get: getStub
};
const defineInjector = sb.stub();
const getRegistry = sb.stub();
const registryHandler = {
	base: {
		defineInjector
	}
};
getRegistry.returns(registryHandler);

const properties: any = {};
const icache = icacheMiddleware().callback({
	middleware: { invalidator: sb.stub(), destroy: sb.stub() },
	properties: () => ({}),
	children: () => [],
	id: 'icache'
});
const { callback } = coreTheme();
let themeMiddleware = callback({
	id: 'coreTheme',
	middleware: {
		invalidator,
		icache,
		diffProperty,
		injector,
		getRegistry
	},
	properties: () => properties,
	children: () => []
});

let composesInstance = theme().callback({
	id: 'theme',
	middleware: {
		coreTheme: themeMiddleware
	},
	properties: () => properties,
	children: () => []
});

describe('theme middleware', () => {
	beforeEach(() => {
		icache.clear();
		properties.theme = undefined;
		properties.classes = undefined;
		composesInstance = theme().callback({
			id: 'theme',
			middleware: {
				coreTheme: themeMiddleware
			},
			properties: () => properties,
			children: () => []
		});
	});
	it('should compose implemented variant css to the base theme', () => {
		const baseClasses = {
			' _key': '@dojo/widgets/Base',
			root: 'base_root',
			selected: 'base_selected',
			active: 'base_active'
		};

		const variantClasses = {
			' _key': '@dojo/widgets/Variant',
			active: 'variant_active',
			extra: 'variant_extra'
		};

		const composedClasses = composesInstance.compose(
			baseClasses,
			variantClasses
		);
		assert.deepEqual(composedClasses, {
			'@dojo/widgets/Base': {
				root: 'base_root',
				selected: 'base_selected',
				active: 'variant_active'
			}
		});
	});

	it('should compose implemented variant css and classes to the base theme', () => {
		const baseClasses = {
			' _key': '@dojo/widgets/Base',
			root: 'base_root',
			selected: 'base_selected',
			active: 'base_active'
		};

		const variantClasses = {
			' _key': '@dojo/widgets/Variant',
			active: 'variant_active',
			extra: 'variant_extra'
		};

		properties.classes = {
			'@dojo/widgets/Base': {
				root: ['base_classes_root']
			},
			'@dojo/widgets/Variant': {
				selected: ['variant_classes_selected']
			}
		};

		const composedClasses = composesInstance.compose(
			baseClasses,
			variantClasses
		);
		assert.deepEqual(composedClasses, {
			'@dojo/widgets/Base': {
				root: 'base_root base_classes_root',
				selected: 'base_selected variant_classes_selected',
				active: 'variant_active'
			}
		});
	});

	it('should compose variant theme and fallback to the base theme', () => {
		const baseClasses = {
			' _key': '@dojo/widgets/Base',
			root: 'base_root',
			selected: 'base_selected',
			active: 'base_active'
		};

		const variantClasses = {
			' _key': '@dojo/widgets/Variant',
			active: 'variant_active',
			extra: 'variant_extra'
		};

		properties.theme = {
			'@dojo/widgets/Base': {
				' _key': '@dojo/widgets/Base',
				root: 'base_theme_root'
			},
			'@dojo/widgets/Variant': {
				' _key': '@dojo/widgets/Variant',
				extra: 'variant_theme_extra',
				selected: 'variant_theme_selected'
			}
		};

		const composedClasses = composesInstance.compose(
			baseClasses,
			variantClasses
		);
		assert.deepEqual(composedClasses, {
			'@dojo/widgets/Base': {
				' _key': '@dojo/widgets/Base',
				root: 'base_theme_root',
				selected: 'variant_theme_selected',
				active: 'variant_active'
			},
			'@dojo/widgets/Variant': {
				' _key': '@dojo/widgets/Variant',
				extra: 'variant_theme_extra',
				selected: 'variant_theme_selected'
			}
		});
	});

	it('should compose base theme using prefix', () => {
		const baseClasses = {
			' _key': '@dojo/widgets/Base',
			root: 'base_root',
			selected: 'base_selected',
			active: 'base_active'
		};

		const variantClasses = {
			' _key': '@dojo/widgets/Variant',
			baseActive: 'variant_active'
		};

		const composedClasses = composesInstance.compose(
			baseClasses,
			variantClasses,
			'base'
		);
		assert.deepEqual(composedClasses, {
			'@dojo/widgets/Base': {
				root: 'base_root',
				selected: 'base_selected',
				active: 'variant_active'
			}
		});
	});

	it('should compose base theme using prefix and variant theme', () => {
		const baseClasses = {
			' _key': '@dojo/widgets/Base',
			root: 'base_root',
			selected: 'base_selected',
			active: 'base_active'
		};

		const variantClasses = {
			' _key': '@dojo/widgets/Variant',
			baseActive: 'variant_active'
		};

		properties.theme = {
			'@dojo/widgets/Variant': {
				' _key': '@dojo/widgets/Variant',
				baseActive: 'variant_theme_active'
			}
		};

		const composedClasses = composesInstance.compose(
			baseClasses,
			variantClasses,
			'base'
		);
		assert.deepEqual(composedClasses, {
			'@dojo/widgets/Base': {
				root: 'base_root',
				selected: 'base_selected',
				active: 'variant_theme_active'
			},
			'@dojo/widgets/Variant': {
				' _key': '@dojo/widgets/Variant',
				baseActive: 'variant_theme_active'
			}
		});
	});

	it('should compose base theme using prefix and variant theme overriding the base theme class', () => {
		const baseClasses = {
			' _key': '@dojo/widgets/Base',
			root: 'base_root',
			selected: 'base_selected',
			active: 'base_active'
		};

		const variantClasses = {
			' _key': '@dojo/widgets/Variant',
			baseActive: 'variant_active'
		};

		properties.theme = {
			'@dojo/widgets/Base': {
				active: 'base_theme_active'
			},
			'@dojo/widgets/Variant': {
				baseActive: 'variant_theme_active'
			}
		};

		const composedClasses = composesInstance.compose(
			baseClasses,
			variantClasses,
			'base'
		);
		assert.deepEqual(composedClasses, {
			'@dojo/widgets/Base': {
				root: 'base_root',
				selected: 'base_selected',
				active: 'variant_theme_active'
			},
			'@dojo/widgets/Variant': {
				baseActive: 'variant_theme_active'
			}
		});
	});

	it('should compose base theme using prefix and variant theme and classes', () => {
		const baseClasses = {
			' _key': '@dojo/widgets/Base',
			root: 'base_root',
			selected: 'base_selected',
			active: 'base_active'
		};

		const variantClasses = {
			' _key': '@dojo/widgets/Variant',
			baseActive: 'variant_active'
		};

		properties.theme = {
			'@dojo/widgets/Variant': {
				baseActive: 'variant_theme_active'
			}
		};

		properties.classes = {
			'@dojo/widgets/Variant': {
				baseActive: ['variant_extra_active']
			}
		};

		const composedClasses = composesInstance.compose(
			baseClasses,
			variantClasses,
			'base'
		);
		assert.deepEqual(composedClasses, {
			'@dojo/widgets/Base': {
				root: 'base_root',
				selected: 'base_selected',
				active: 'variant_theme_active variant_extra_active'
			},
			'@dojo/widgets/Variant': {
				baseActive: 'variant_theme_active'
			}
		});
	});

	it('should compose base theme using prefix and classes', () => {
		const baseClasses = {
			' _key': '@dojo/widgets/Base',
			root: 'base_root',
			selected: 'base_selected',
			active: 'base_active'
		};

		const variantClasses = {
			' _key': '@dojo/widgets/Variant'
		};

		properties.classes = {
			'@dojo/widgets/Variant': {
				baseActive: ['variant_extra_active']
			}
		};

		const composedClasses = composesInstance.compose(
			baseClasses,
			variantClasses,
			'base'
		);
		assert.deepEqual(composedClasses, {
			'@dojo/widgets/Base': {
				root: 'base_root',
				selected: 'base_selected',
				active: 'base_active variant_extra_active'
			}
		});
	});

	it('should compose base theme using prefix and enable theming even when the prefixed class does not exist in the variant css', () => {
		const baseClasses = {
			' _key': '@dojo/widgets/Base',
			root: 'base_root',
			selected: 'base_selected',
			active: 'base_active'
		};

		const variantClasses = {
			' _key': '@dojo/widgets/Variant'
		};

		properties.theme = {
			'@dojo/widgets/Variant': {
				baseActive: 'variant_theme_active'
			}
		};

		const composedClasses = composesInstance.compose(
			baseClasses,
			variantClasses,
			'base'
		);
		assert.deepEqual(composedClasses, {
			'@dojo/widgets/Base': {
				root: 'base_root',
				selected: 'base_selected',
				active: 'variant_theme_active'
			},
			'@dojo/widgets/Variant': {
				baseActive: 'variant_theme_active'
			}
		});
	});

	it('should not pass common classes down to if not explicitly prefixed', () => {
		const baseClasses = {
			' _key': '@dojo/widgets/Base',
			root: 'base_root',
			selected: 'base_selected',
			active: 'base_active'
		};

		const variantClasses = {
			' _key': '@dojo/widgets/Variant'
		};

		properties.theme = {
			'@dojo/widgets/Variant': {
				active: 'variant_theme_active'
			}
		};

		const composedClasses = composesInstance.compose(
			baseClasses,
			variantClasses,
			'base'
		);
		assert.deepEqual(composedClasses, {
			'@dojo/widgets/Base': {
				root: 'base_root',
				selected: 'base_selected',
				active: 'base_active'
			},
			'@dojo/widgets/Variant': {
				active: 'variant_theme_active'
			}
		});
	});

	it('should not create empty keys', () => {
		const baseClasses = {
			' _key': '@dojo/widgets/Base',
			root: 'base_root',
			selected: 'base_selected',
			active: 'base_active'
		};

		const variantClasses = {
			' _key': '@dojo/widgets/Variant',
			base: 'variant_base',
			baseActive: 'variant_active'
		};

		const composedClasses = composesInstance.compose(
			baseClasses,
			variantClasses,
			'base'
		);
		assert.deepEqual(composedClasses, {
			'@dojo/widgets/Base': {
				root: 'base_root',
				selected: 'base_selected',
				active: 'variant_active'
			}
		});
	});

	it('should work with theme variants', () => {
		const baseClasses = {
			' _key': '@dojo/widgets/Base',
			root: 'base_root',
			selected: 'base_selected',
			active: 'base_active'
		};

		const variantClasses = {
			' _key': '@dojo/widgets/Variant',
			active: 'variant_active',
			extra: 'variant_extra'
		};

		properties.theme = {
			theme: {
				theme: {
					'@dojo/widgets/Base': {
						root: 'base_theme_root'
					},
					'@dojo/widgets/Variant': {
						extra: 'variant_theme_extra',
						selected: 'variant_theme_selected'
					}
				},
				variants: {
					default: {
						root: 'default root variant'
					}
				}
			},
			variant: {
				name: 'default',
				value: {
					root: 'default root variant'
				}
			}
		};

		const composedClasses = composesInstance.compose(
			baseClasses,
			variantClasses
		);
		assert.deepEqual(composedClasses, {
			theme: {
				theme: {
					'@dojo/widgets/Base': {
						root: 'base_theme_root',
						selected: 'variant_theme_selected',
						active: 'variant_active'
					},
					'@dojo/widgets/Variant': {
						extra: 'variant_theme_extra',
						selected: 'variant_theme_selected'
					}
				},
				variants: {
					default: {
						root: 'default root variant'
					}
				}
			},
			variant: {
				name: 'default',
				value: {
					root: 'default root variant'
				}
			}
		});
	});

	it('should work with theme with variant and prefix', () => {
		const baseClasses = {
			' _key': '@dojo/widgets/Base',
			root: 'base_root',
			selected: 'base_selected',
			active: 'base_active'
		};

		const variantClasses = {
			' _key': '@dojo/widgets/Variant',
			baseActive: 'variant_active'
		};

		properties.theme = {
			theme: {
				theme: {
					'@dojo/widgets/Base': {
						active: 'base_theme_active'
					},
					'@dojo/widgets/Variant': {
						baseActive: 'variant_theme_active'
					}
				},
				variants: {
					default: {
						root: 'default root variant'
					}
				}
			},
			variant: {
				name: 'default',
				value: {
					root: 'default root variant'
				}
			}
		};

		const composedClasses = composesInstance.compose(
			baseClasses,
			variantClasses,
			'base'
		);
		assert.deepEqual(composedClasses, {
			theme: {
				theme: {
					'@dojo/widgets/Base': {
						root: 'base_root',
						selected: 'base_selected',
						active: 'variant_theme_active'
					},
					'@dojo/widgets/Variant': {
						baseActive: 'variant_theme_active'
					}
				},
				variants: {
					default: {
						root: 'default root variant'
					}
				}
			},
			variant: {
				name: 'default',
				value: {
					root: 'default root variant'
				}
			}
		});
	});

	it('Use theme with variant set in the injector', () => {
		const baseClasses = {
			' _key': '@dojo/widgets/Base',
			root: 'base_root',
			selected: 'base_selected',
			active: 'base_active'
		};

		const variantClasses = {
			' _key': '@dojo/widgets/Variant',
			baseActive: 'variant_active'
		};

		properties.theme = undefined;
		const injector = new ThemeInjector({
			theme: {
				theme: {
					'@dojo/widgets/Base': {
						active: 'base_theme_active'
					},
					'@dojo/widgets/Variant': {
						baseActive: 'variant_theme_active'
					}
				},
				variants: {
					default: {
						root: 'default root variant'
					}
				}
			},
			variant: {
				name: 'default',
				value: {
					root: 'default root variant'
				}
			}
		});
		getStub.returns(injector);

		const composedClasses = composesInstance.compose(
			baseClasses,
			variantClasses,
			'base'
		);
		assert.deepEqual(composedClasses, {
			theme: {
				theme: {
					'@dojo/widgets/Base': {
						root: 'base_root',
						selected: 'base_selected',
						active: 'variant_theme_active'
					},
					'@dojo/widgets/Variant': {
						baseActive: 'variant_theme_active'
					}
				},
				variants: {
					default: {
						root: 'default root variant'
					}
				}
			},
			variant: {
				name: 'default',
				value: {
					root: 'default root variant'
				}
			}
		});
	});

	it('Use theme set in the injector', () => {
		const baseClasses = {
			' _key': '@dojo/widgets/Base',
			root: 'base_root',
			selected: 'base_selected',
			active: 'base_active'
		};

		const variantClasses = {
			' _key': '@dojo/widgets/Variant',
			baseActive: 'variant_active'
		};

		properties.theme = undefined;
		const injector = new ThemeInjector({
			'@dojo/widgets/Variant': {
				baseActive: 'variant_theme_active'
			}
		});
		getStub.returns(injector);

		const composedClasses = composesInstance.compose(
			baseClasses,
			variantClasses,
			'base'
		);
		assert.deepEqual(composedClasses, {
			'@dojo/widgets/Base': {
				root: 'base_root',
				selected: 'base_selected',
				active: 'variant_theme_active'
			},
			'@dojo/widgets/Variant': {
				baseActive: 'variant_theme_active'
			}
		});
	});

	it('should not apply variant if set to inherit', () => {
		properties.theme = {
			theme: {
				theme: {
					'@dojo/widgets/Base': {
						active: 'base_theme_active'
					},
					'@dojo/widgets/Variant': {
						baseActive: 'variant_theme_active'
					}
				},
				variants: {
					default: {
						root: 'default root variant'
					}
				}
			},
			variant: {
				name: 'default',
				value: {
					root: 'default root variant'
				}
			}
		};

		assert.strictEqual(composesInstance.variant(), 'default root variant');
		properties.variant = 'inherit';
		assert.isUndefined(composesInstance.variant());
	});
});
