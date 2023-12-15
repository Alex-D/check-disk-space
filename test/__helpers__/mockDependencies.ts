import { normalize } from 'node:path'
import { promisify } from 'node:util'

import Dependencies from '@/src/types/dependencies'

function mockDependencies(overrides?: Partial<Dependencies>, options?: {
	cpExecFileOutput?: string
	cpExecFileError?: Error
}): Dependencies {
	const dependencies: Dependencies = {
		platform: 'linux',
		release: '11.5.0',
		fsAccess: () => Promise.resolve(),
		pathNormalize: normalize,
		pathSep: '/',
		cpExecFile: async () => {
			await promisify(process.nextTick)

			if (options?.cpExecFileError !== undefined) {
				return Promise.reject(options.cpExecFileError)
			}

			return {
				stdout: options?.cpExecFileOutput ?? '',
				stderr: '',
			}
		},
		...overrides,
	}

	return dependencies
}

export default mockDependencies
