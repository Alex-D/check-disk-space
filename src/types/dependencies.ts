import {execFile} from 'child_process'
import {existsSync} from 'fs'
import {normalize, sep} from 'path'

type Dependencies = {
	platform: NodeJS.Platform,
	fsExistsSync: typeof existsSync,
	pathNormalize: typeof normalize,
	pathSep: typeof sep,
	cpExecFile: typeof execFile,
}

export default Dependencies
