import TsconfigPathsPlugin from '@esbuild-plugins/tsconfig-paths'
import esbuild from 'esbuild'

esbuild.build({
	entryPoints: ['src/index.ts'],
	platform: 'node',
	bundle: true,
	target: 'node12',
	outfile: 'dist/index.js',
}).catch(() => process.exit(1))
