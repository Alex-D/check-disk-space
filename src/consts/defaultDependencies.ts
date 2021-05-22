import {execFile} from 'child_process'
import {existsSync} from 'fs'
import {normalize, sep} from 'path'

const DEFAULT_DEPENDENCIES = {
	platform: process.platform,
	fsExistsSync: existsSync,
	pathNormalize: normalize,
	pathSep: sep,
	cpExecFile: execFile,
}

export default DEFAULT_DEPENDENCIES
