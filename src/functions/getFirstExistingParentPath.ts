import Dependencies from '@/src/types/dependencies'

/**
 * Get the first existing parent path
 *
 * @param {String} directoryPath - The file/folder path from where we want to know disk space
 * @param {Object} dependencies - Dependencies container
 * @returns {String} - The first existing parent path
 */
function getFirstExistingParentPath(directoryPath: string, dependencies: Dependencies): string {
	let parentDirectoryPath = directoryPath
	let parentDirectoryFound = dependencies.fsExistsSync(parentDirectoryPath)

	while (!parentDirectoryFound) {
		parentDirectoryPath = dependencies.pathNormalize(parentDirectoryPath + '/..')
		parentDirectoryFound = dependencies.fsExistsSync(parentDirectoryPath)
	}

	return parentDirectoryPath
}

export default getFirstExistingParentPath
