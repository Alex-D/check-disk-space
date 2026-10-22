import isDirectoryExisting from "../functions/isDirectoryExisting.ts";
import type { Dependencies } from "../types/dependencies.ts";

/**
 * Get the first existing parent path
 *
 * @param directoryPath - The file/folder path from where we want to know disk space
 * @param dependencies - Dependencies container
 */
async function getFirstExistingParentPath(
	directoryPath: string,
	dependencies: Dependencies,
): Promise<string> {
	let parentDirectoryPath = directoryPath;
	let parentDirectoryFound = await isDirectoryExisting(parentDirectoryPath, dependencies);

	while (!parentDirectoryFound) {
		parentDirectoryPath = dependencies.pathNormalize(parentDirectoryPath + "/..");
		parentDirectoryFound = await isDirectoryExisting(parentDirectoryPath, dependencies);
	}

	return parentDirectoryPath;
}

export default getFirstExistingParentPath;
