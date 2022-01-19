/**
 * Run the command and do common things between win32 and unix
 *
 * @param cmd - The command to execute
 * @param filter - To filter drives (only used for win32)
 * @param mapping - Map between column index and normalized column name
 * @param coefficient - The size coefficient to get bytes instead of kB
 */

type Check = {
	cmd: string[],
	filter: (driveData: string[]) => boolean,
	mapping: Record<string, number>,
	coefficient?: number,
	options?: { shell?: boolean }
}

export default Check
