import type { Dependencies } from "../types/dependencies.ts";
import isDirectoryExisting from "../functions/isDirectoryExisting.ts";
import NoMatchError from "../errors/noMatchError.ts";

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
		const newParentDirectoryPath = dependencies.pathNormalize(parentDirectoryPath + "/..");
		// Prevents from infinite loop on Windows when using a path with a non-existing drive letter
		if (parentDirectoryPath === newParentDirectoryPath || newParentDirectoryPath === ".") {
			return Promise.reject(new NoMatchError("Unable to find an existing parent path."));
		}
		parentDirectoryPath = newParentDirectoryPath;
		parentDirectoryFound = await isDirectoryExisting(parentDirectoryPath, dependencies);
	}

	return parentDirectoryPath;
}

export default getFirstExistingParentPath;
