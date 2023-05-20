import Dependencies from '@/src/types/dependencies'

/**
 * Tell if PowerShell 3 is available based on Windows version
 *
 * Note: 6.* is Windows 7
 * Note: PowerShell 3 is natively available since Windows 8
 *
 * @param dependencies - Dependencies Injection Container
 */
function hasPowerShell3(dependencies: Dependencies): Promise<boolean> {
	const major = parseInt(dependencies.release.split('.')[0], 10)

	if (major <= 6) {
		return Promise.resolve(false)
	}

	return new Promise<boolean>(function (resolve) {
		dependencies.cpExecFile('where', ['powershell'], { windowsHide: true }, function (error) {
			resolve(!error)
		})
	})
}

export default hasPowerShell3
