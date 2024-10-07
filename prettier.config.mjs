/** @type {import("prettier").Options} */
export default {
	arrowParens: "always",
	bracketSpacing: true,
	endOfLine: "lf",
	htmlWhitespaceSensitivity: "css",
	insertPragma: false,
	singleAttributePerLine: false,
	bracketSameLine: false,
	jsxBracketSameLine: false,
	jsxSingleQuote: false,
	printWidth: 80,
	proseWrap: "preserve",
	quoteProps: "as-needed",
	requirePragma: false,
	semi: false,
	singleQuote: false,
	useTabs: true,
	overrides: [
		// formatting the package.json with anything other than spaces will cause
		// issues when running install...
		{
			files: ["**/package.json"],
			options: {
				useTabs: false,
			},
		},
		{
			files: ["**/*.mdx"],
			options: {
				// This stinks, if you don't do this, then an inline component on the
				// end of the line will end up wrapping, then the next save prettier
				// will add an extra line break. Super annoying and probably a bug in
				// prettier, but until it's fixed, this is the best we can do.
				proseWrap: "preserve",
				htmlWhitespaceSensitivity: "ignore",
			},
		},
	],
	trailingComma: "all",
	useTabs: true,
	importOrder: ["^react", "<THIRD_PARTY_MODULES>", "antd", "^@/.*", "^[./]"],
	importOrderSeparation: false,
	importOrderSortSpecifiers: true,
	plugins: ["@trivago/prettier-plugin-sort-imports"],
}
