// eslint-disable-next-line
module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
	},
	"extends": "eslint:recommended",
	"overrides": [
	],
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module",
	},
	"rules": {
		"indent": [
			"error",
			"tab",
			{
				"SwitchCase": 1,
			},
		],
		"linebreak-style": [
			"error",
			"unix",
		],
		"quotes": [
			"error",
			"double",
			{
				"allowTemplateLiterals": true,
			},
		],
		"semi": [
			"error",
			"always",
		],
		"prefer-const": "error",
		"no-inner-declarations": "off",
	},
	"globals": {
		"storageManager": "readonly",
		"settingsManager": "readonly",
		"webCodeExecutor": "readonly",
		"fileSystemManager": "readonly",
		"tutorialFunctions": "readonly",
		"executorRootURL": "readonly",
		"monaco": "readonly",
		"alertCustom": "readonly",
		"confirmCustom": "readonly",
		"promptCustom": "readonly",
		"html_beautify": "readonly",
		"css_beautify": "readonly",
		"js_beautify": "readonly",
		"userSettings": "readonly",
	},
};
