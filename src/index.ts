import { execFile } from "node:child_process";
import { access } from "node:fs/promises";
import { release } from "node:os";
import { normalize, sep } from "node:path";
import { platform } from "node:process";
import { promisify } from "node:util";

import InvalidPathError from "./errors/invalidPathError.ts";
import NoMatchError from "./errors/noMatchError.ts";
import getFirstExistingParentPath from "./functions/getFirstExistingParentPath.ts";
import hasPowerShell3 from "./functions/hasPowerShell3.ts";
import type { Dependencies } from "./types/dependencies.ts";
import type { DiskSpace } from "./types/diskSpace.ts";

/**
 * Check disk space
 *
 * @param directoryPath - The file/folder path from where we want to know disk space
 * @param dependencies - Dependencies container
 */
function checkDiskSpace(
	directoryPath: string,
	dependencies: Dependencies = {
		platform,
		release: release(),
		fsAccess: access,
		pathNormalize: normalize,
		pathSep: sep,
		cpExecFile: promisify(execFile),
	},
): Promise<DiskSpace> {
	// Note: This function contains other functions
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
		const parsed = stdout
			.split("\n") // Split lines
			.map((line) => line.trim()) // Trim all lines
			.filter((line) => line.length !== 0) // Remove empty lines
			.slice(1) // Remove header
			.map((line) => line.split(/\s+(?=[\d/])/)); // Split on spaces to get columns

		const filtered = parsed.filter(filter);

		if (filtered.length === 0) {
			let errorContext = "No disk matches the path.";
			if (parsed.length === 0) {
				errorContext = "Nothing was returned by the command.";
			}
			throw new NoMatchError(errorContext);
		}

		// Needed to skip empty columns on some lines (see AWS AppRunner test case)
		const columnsCount = parsed.reduce((maxColumnCount, currentLine) => {
			return Math.max(currentLine.length, maxColumnCount);
		}, 0);

		const diskData = filtered[0];
		const indexOffset = diskData.length - columnsCount;

		return {
			diskPath: diskData[mapping.diskPath + indexOffset],
			free: parseInt(diskData[mapping.free + indexOffset], 10) * coefficient,
			size: parseInt(diskData[mapping.size + indexOffset], 10) * coefficient,
		};
	}

	/**
	 * Run the command and do common things between win32 and Unix
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
		const [file, ...args] = cmd;

		/* istanbul ignore if */
		if (file === undefined) {
			return Promise.reject(new Error("cmd must contain at least one item"));
		}

		try {
			const { stdout } = await dependencies.cpExecFile(file, args, { windowsHide: true });
			return mapOutput(stdout, filter, mapping, coefficient);
		} catch (error) {
			return Promise.reject(error);
		}
	}

	/**
	 * Build the check call for win32
	 *
	 * @param directoryPath - The file/folder path from where we want to know disk space
	 */
	async function checkWin32(directoryPath: string): Promise<DiskSpace> {
		if (directoryPath.charAt(1) !== ":") {
			return Promise.reject(
				new InvalidPathError(`The following path is invalid (should be X:\\...): ${directoryPath}`),
			);
		}

		const powershellCmd = [
			"powershell",
			"Get-CimInstance -ClassName Win32_LogicalDisk | Select-Object Caption, FreeSpace, Size",
		];
		const wmicCmd = ["wmic", "logicaldisk", "get", "size,freespace,caption"];
		const cmd = (await hasPowerShell3(dependencies)) ? powershellCmd : wmicCmd;

		return check(
			cmd,
			(driveData) => {
				// Only get the drive that matches the path
				const driveLetter = driveData[0];
				return directoryPath.toUpperCase().startsWith(driveLetter.toUpperCase());
			},
			{
				diskPath: 0,
				free: 1,
				size: 2,
			},
		);
	}

	/**
	 * Build the check call for Unix
	 *
	 * @param directoryPath - The file/folder path from where we want to know disk space
	 */
	async function checkUnix(directoryPath: string): Promise<DiskSpace> {
		if (!dependencies.pathNormalize(directoryPath).startsWith(dependencies.pathSep)) {
			return Promise.reject(
				new InvalidPathError(
					`The following path is invalid (should start by ${dependencies.pathSep}): ${directoryPath}`,
				),
			);
		}

		const pathToCheck = await getFirstExistingParentPath(directoryPath, dependencies);

		return check(
			["df", "-Pk", "--", pathToCheck],
			() => true, // We should only get one line, so we did not need to filter
			{
				diskPath: 5,
				free: 3,
				size: 1,
			},
			1024, // We get sizes in kB, we need to convert that to bytes
		);
	}

	// Call the right check depending on the OS
	if (dependencies.platform === "win32") {
		return checkWin32(directoryPath);
	}

	return checkUnix(directoryPath);
}

export {
	// Functions
	checkDiskSpace,
	getFirstExistingParentPath,

	// Errors
	InvalidPathError,
	NoMatchError,
};

// Types
export type { Dependencies, DiskSpace };
