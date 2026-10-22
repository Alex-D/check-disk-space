import { defineConfig, defaultExclude } from "vite-plus";

const OUTPUT_BASE_FILE_NAME = "check-disk-space";

export default defineConfig({
	pack: [
		{
			entry: {
				[OUTPUT_BASE_FILE_NAME]: `src/index.ts`,
			},
		},
	],
	staged: {
		"*": "vp check --fix",
	},
	lint: {
		jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
		rules: { "vite-plus/prefer-vite-plus-imports": "error" },
		options: { typeAware: true, typeCheck: true },
	},
	test: {
		include: ["tests/**/*.test.ts"],
		exclude: [...defaultExclude, "tests/dist.test.ts"],
		coverage: {
			provider: "istanbul",
			thresholds: {
				100: true,
			},
			include: ["src/**/*.ts"],
		},
	},
	run: {
		tasks: {
			"test:dist": {
				command: "vp test --config vite.dist.config.ts",
				dependsOn: ["build"],
			},
		},
	},
});
