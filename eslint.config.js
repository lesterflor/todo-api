module.exports = {
	extends: [
		'eslint:recommended',
		'eslint-config-prettier',
		'prettier',
		'plugin:@typescript-eslint/recommended',
	],
	plugins: ['@typescript-eslint', 'prettier'],
	rules: {
		// Override or add rules as needed
	},
	settings: {
		'import/resolver': {
			typescript: {},
		},
	},
};
