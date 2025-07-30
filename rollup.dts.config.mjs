import dts from 'rollup-plugin-dts'

import config from './rollup.config.mjs'

config.output = [
	{
		file: 'dist/check-disk-space.d.mts',
		format: 'es',
	},
	{
		file: 'dist/check-disk-space.d.cts',
		format: 'cjs',
	},
]
config.plugins.push(dts())

export default config
