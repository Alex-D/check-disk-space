import Dependencies from '@/src/types/dependencies'

/**
 * Tells if directory exists
 *
 * @param directoryPath - The file/folder path
 * @param dependencies - Dependencies container
 */
async function isDirectoryExisting(directoryPath: string, dependencies: Dependencies): Promise<boolean> {
	try {
		await dependencies.fsAccess(directoryPath)
		return Promise.resolve(true)
	} catch (error) {
		return Promise.resolve(false)
	}
}

export default isDirectoryExisting
