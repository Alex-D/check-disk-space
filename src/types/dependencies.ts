import {ChildProcess, ExecFileException} from 'child_process'
import {existsSync} from 'fs'
import {normalize, sep} from 'path'

type Dependencies = {
	platform: NodeJS.Platform
	fsExistsSync: typeof existsSync
	pathNormalize: typeof normalize
	pathSep: typeof sep
	release: string
	cpExecFile: (
		file: string, 
		args: ReadonlyArray<string> | undefined | null, 
		options: { shell?: boolean },
		callback: (
			error: ExecFileException | null, 
			stdout: string, 
			stderr: string
		) => void
	) => ChildProcess
}

export default Dependencies
