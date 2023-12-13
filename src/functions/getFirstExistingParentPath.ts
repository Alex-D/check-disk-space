import isDirectoryExisting from '@/src/functions/isDirectoryExisting'
import Dependencies from '@/src/types/dependencies'

/**
 * Get the first existing parent path
 *
 * @param directoryPath - The file/folder path from where we want to know disk space
 * @param dependencies - Dependencies container
 */
async function getFirstExistingParentPath(directoryPath: string, dependencies: Dependencies): Promise<string> {
	let parentDirectoryPath = dependencies.pathNormalize(directoryPath)
	let parentDirectoryFound = await isDirectoryExisting(parentDirectoryPath, dependencies)

	for (let i = 0; i < 4096 && !parentDirectoryFound; ++i) {
		const newParentDirectoryPath = dependencies.pathNormalize(parentDirectoryPath + '/..')
		if (parentDirectoryPath === newParentDirectoryPath) {
			return ''
		}
		parentDirectoryPath = newParentDirectoryPath
		parentDirectoryFound = await isDirectoryExisting(parentDirectoryPath, dependencies)
	}

	return parentDirectoryPath !== '.' ? parentDirectoryPath : ''
}

export default getFirstExistingParentPath
