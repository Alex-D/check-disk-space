/**
 * Tell if PowerShell 3 is available based on Windows version
 *
 * Note: 6.* is Windows 7
 * Note: PowerShell 3 is natively available since Windows 8
 *
 * @param release - OS Release number
 */
function hasPowerShell3(release: string): boolean {
	const major = parseInt(release.split('.')[0], 10)

	return major > 6
}

export default hasPowerShell3
