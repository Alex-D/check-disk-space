import {ChildProcess, ExecFileException} from 'child_process'
import {existsSync} from 'fs'
import {normalize, sep} from 'path'

/**
 * @public
 */
type Dependencies = {
	platform: NodeJS.Platform
	fsExistsSync: typeof existsSync
	pathNormalize: typeof normalize
	pathSep: typeof sep
	cpExecFile: (file: string, args: ReadonlyArray<string> | undefined | null, callback: (error: ExecFileException | null, stdout: string, stderr: string) => void) => ChildProcess
}

export default Dependencies
