module.exports = {
	extends: [
		'eslint-config-airbnb-base',
		'eslint-config-airbnb-base/rules/strict',
	].map(require.resolve).concat('plugin:flowtype/recommended'),

	parser: 'babel-eslint',

	plugins: [
		'flowtype',
	],

	rules: {
		// es6
		'arrow-parens': ['error', 'as-needed'],

		// import
		'import/no-extraneous-dependencies': ['error', {
			devDependencies: [
				'**/example/*.js',
				'**/webpack.config.js',
			]
		}],

		// style
		indent: ['error', 'tab', { SwitchCase: 1 }],
		'no-underscore-dangle': 'off',
		'no-tabs': 'off',
	},

	env: {
		browser: true,
		jest: true,
	},

	globals: {
		// can be used by webpack to perform dead code elimination
		__DEV__: false,
	},
};
