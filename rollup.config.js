import rollupTypeScript from '@rollup/plugin-typescript'

export default {
	input: 'src/index.ts',
	output: [
		{
			file: 'dist/check-disk-space.cjs.js',
			format: 'cjs',
			exports: 'named',
		},
		{
			file: 'dist/check-disk-space.mjs.js',
			format: 'es',
		},
	],
	plugins: [
		rollupTypeScript(),
	],
	external: [
		'fs',
		'path',
		'child_process',
	],
}
