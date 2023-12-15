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

	const FAILED_TO_FIND_EXISTING_DIRECTORY_VALUE = ''

	/**
	 * Linux max file path length is 4096 characters.
	 * With / separators and 1 letter folder names, this gives us a max of ~2048 folders to traverse.
	 * This is much less error prone than a while loop.
	 */
	const maxNumberOfFolders = 2048
	for (let i = 0; i < maxNumberOfFolders && !parentDirectoryFound; ++i) {
		const newParentDirectoryPath = dependencies.pathNormalize(parentDirectoryPath + '/..')
		if (parentDirectoryPath === newParentDirectoryPath || parentDirectoryPath === '.') {
			return FAILED_TO_FIND_EXISTING_DIRECTORY_VALUE
		}
		parentDirectoryPath = newParentDirectoryPath
		parentDirectoryFound = await isDirectoryExisting(parentDirectoryPath, dependencies)
	}

	if (parentDirectoryPath !== '.') {
		return parentDirectoryPath
	}

	return FAILED_TO_FIND_EXISTING_DIRECTORY_VALUE
}

export default getFirstExistingParentPath
