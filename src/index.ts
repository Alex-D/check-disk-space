import { execFile } from 'node:child_process'
import { access } from 'node:fs/promises'
import { release } from 'node:os'
import { normalize, sep } from 'node:path'
import { platform } from 'node:process'
import { promisify } from 'node:util'

import InvalidPathError from '@/src/errors/invalidPathError'
import NoMatchError from '@/src/errors/noMatchError'
import getFirstExistingParentPath from '@/src/functions/getFirstExistingParentPath'
import hasPowerShell3 from '@/src/functions/hasPowerShell3'
import Dependencies from '@/src/types/dependencies'
import DiskSpace from '@/src/types/diskSpace'

/**
 * Check disk space
 *
 * @param directoryPath - The file/folder path from where we want to know disk space
 * @param dependencies - Dependencies container
 */
function checkDiskSpace(directoryPath: string, dependencies: Dependencies = {
	platform,
	release: release(),
	fsAccess: access,
	pathNormalize: normalize,
	pathSep: sep,
	cpExecFile: promisify(execFile),
}): Promise<DiskSpace> {
	// Note: This function contains other functions in order
	//       to wrap them in a common context and make unit tests easier

	/**
	 * Maps command output to a normalized object {diskPath, free, size}
	 *
	 * @param stdout - The command output
	 * @param filter - To filter drives (only used for win32)
	 * @param mapping - Map between column index and normalized column name
	 * @param coefficient - The size coefficient to get bytes instead of kB
	 */
	function mapOutput(
		stdout: string,
		filter: (driveData: string[]) => boolean,
		mapping: Record<string, number>,
		coefficient: number,
	): DiskSpace {
		const parsed = stdout.trim().split('\n').slice(1).map(line => {
			return line.trim().split(/\s+(?=[\d/])/)
		})

		const filtered = parsed.filter(filter)

		if (filtered.length === 0) {
			throw new NoMatchError()
		}

		const diskData = filtered[0]

		return {
			diskPath: diskData[mapping.diskPath],
			free: parseInt(diskData[mapping.free], 10) * coefficient,
			size: parseInt(diskData[mapping.size], 10) * coefficient,
		}
	}

	/**
	 * Run the command and do common things between win32 and unix
	 *
	 * @param cmd - The command to execute
	 * @param filter - To filter drives (only used for win32)
	 * @param mapping - Map between column index and normalized column name
	 * @param coefficient - The size coefficient to get bytes instead of kB
	 */
	async function check(
		cmd: string[],
		filter: (driveData: string[]) => boolean,
		mapping: Record<string, number>,
		coefficient = 1,
	): Promise<DiskSpace> {
		const [
			file,
			...args
		] = cmd

		/* istanbul ignore if */
		if (file === undefined) {
			return Promise.reject(new Error('cmd must contain at least one item'))
		}

		try {
			const { stdout } = await dependencies.cpExecFile(file, args, { windowsHide: true })
			return mapOutput(stdout, filter, mapping, coefficient)
		} catch (error) {
			return Promise.reject(error)
		}
	}

	/**
	 * Build the check call for win32
	 *
	 * @param directoryPath - The file/folder path from where we want to know disk space
	 */
	async function checkWin32(directoryPath: string): Promise<DiskSpace> {
		if (directoryPath.charAt(1) !== ':') {
			return Promise.reject(new InvalidPathError(`The following path is invalid (should be X:\\...): ${directoryPath}`))
		}

		const powershellCmd = [
			'powershell',
			'Get-CimInstance -ClassName Win32_LogicalDisk | Select-Object Caption, FreeSpace, Size',
		]
		const wmicCmd = [
			'wmic',
			'logicaldisk',
			'get',
			'size,freespace,caption',
		]
		const cmd = await hasPowerShell3(dependencies) ? powershellCmd : wmicCmd

		return check(
			cmd,
			driveData => {
				// Only get the drive which match the path
				const driveLetter = driveData[0]
				return directoryPath.toUpperCase().startsWith(driveLetter.toUpperCase())
			},
			{
				diskPath: 0,
				free: 1,
				size: 2,
			},
		)
	}

	/**
	 * Build the check call for unix
	 *
	 * @param directoryPath - The file/folder path from where we want to know disk space
	 */
	async function checkUnix(directoryPath: string): Promise<DiskSpace> {
		if (!dependencies.pathNormalize(directoryPath).startsWith(dependencies.pathSep)) {
			return Promise.reject(new InvalidPathError(`The following path is invalid (should start by ${dependencies.pathSep}): ${directoryPath}`))
		}

		const pathToCheck = await getFirstExistingParentPath(directoryPath, dependencies)

		return check(
			[
				'df',
				'-Pk',
				'--',
				pathToCheck,
			],
			() => true, // We should only get one line, so we did not need to filter
			{
				diskPath: 5,
				free: 3,
				size: 1,
			},
			1024, // We get sizes in kB, we need to convert that to bytes
		)
	}


	// Call the right check depending on the OS
	if (dependencies.platform === 'win32') {
		return checkWin32(directoryPath)
	}

	return checkUnix(directoryPath)
}

export default checkDiskSpace
export {
	Dependencies,
	DiskSpace,
	getFirstExistingParentPath,
	InvalidPathError,
	NoMatchError,
}
