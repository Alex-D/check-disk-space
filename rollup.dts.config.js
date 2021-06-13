import dts from 'rollup-plugin-dts'

import config from './rollup.config'

config.output = [
	{
		file: 'dist/check-disk-space.d.ts',
		format: 'es',
	},
]
config.plugins.push(dts())

export default config
