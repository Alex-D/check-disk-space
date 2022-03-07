import { ChildProcess } from 'child_process'
import { EventEmitter } from 'events'
import { normalize } from 'path'

import Dependencies from '@/src/types/dependencies'

function mockDependencies(overrides?: Partial<Dependencies>, options?: {
	cpExecFileOutput?: string
	cpExecFileError?: Error
}): Dependencies {
	const dependencies: Dependencies = {
		platform: 'linux',
		release: '11.5.0',
		fsExistsSync: () => true,
		pathNormalize: normalize,
		pathSep: '/',
		cpExecFile: (cmd, args, callback) => {
			process.nextTick(() => {
				if (options?.cpExecFileError !== undefined) {
					callback(options.cpExecFileError, '', '')
				}

				callback(null, options?.cpExecFileOutput ?? '', '')
			})

			return new EventEmitter() as ChildProcess
		},
		...overrides,
	}

	return dependencies
}

export default mockDependencies
