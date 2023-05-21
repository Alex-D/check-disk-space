import { access } from 'node:fs/promises'
import { normalize, sep } from 'node:path'

type Dependencies = {
	platform: NodeJS.Platform
	release: string
	fsAccess: typeof access
	pathNormalize: typeof normalize
	pathSep: typeof sep
	cpExecFile: (
		file: string,
		args: ReadonlyArray<string> | undefined | null,
		options: {
			windowsHide: true
		}
	) => Promise<{
		stdout: string
		stderr: string
	}>
}

export default Dependencies
