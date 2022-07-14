import Dependencies from '@/src/types/dependencies'

/**
 * Tell if PowerShell 3 is available based on Windows version
 *
 * Note: 6.* is Windows 7
 * Note: PowerShell 3 is natively available since Windows 8
 *
 * @param release - OS Release number
 */
function hasPowerShell3(dependencies: Dependencies): boolean {
	const major = parseInt(dependencies.release.split('.')[0], 10)

	if (major > 6)
	{
		try {
			dependencies.cpExecFileSync('powershell')
			return true
		} catch (err) {
			return false
		}
	} else {
		return false
	}
}

export default hasPowerShell3
