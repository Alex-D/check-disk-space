import { ChildProcess, ExecException } from 'child_process'
import { existsSync } from 'fs'
import { normalize, sep } from 'path'

type ExecFileException = ExecException & NodeJS.ErrnoException

type Dependencies = {
	platform: NodeJS.Platform
	release: string
	fsExistsSync: typeof existsSync
	pathNormalize: typeof normalize
	pathSep: typeof sep
	cpExecFile: (file: string, args: ReadonlyArray<string> | undefined | null, callback: (error: ExecFileException | null, stdout: string, stderr: string) => void) => ChildProcess
}

export default Dependencies
