import Dependencies from '@/src/types/dependencies'

/**
 * Tell if PowerShell 3 is available based on Windows version
 *
 * Note: 6.* is Windows 7
 * Note: PowerShell 3 is natively available since Windows 8
 *
 * @param dependencies - Dependencies Injection Container
 */
async function hasPowerShell3(dependencies: Dependencies): Promise<boolean> {
	const major = parseInt(dependencies.release.split('.')[0], 10)

	if (major <= 6) {
		return false
	}

	try {
		await dependencies.cpExecFile('where', ['powershell'], { windowsHide: true })
		return true
	} catch (error) {
		return false
	}
}

export default hasPowerShell3
