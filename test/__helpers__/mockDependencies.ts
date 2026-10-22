import { normalize } from "node:path";

import type { Dependencies } from "../../src/index.ts";

async function nextTick(): Promise<void> {
	return new Promise<void>((resolve) => {
		setTimeout(() => resolve(), 0);
	});
}

function mockDependencies(
	overrides?: Partial<Dependencies>,
	options?: {
		cpExecFileOutput?: string;
		cpExecFileError?: Error;
	},
): Dependencies {
	const dependencies: Dependencies = {
		platform: "linux",
		release: "11.5.0",
		fsAccess: () => Promise.resolve(),
		pathNormalize: normalize,
		pathSep: "/",
		cpExecFile: async () => {
			await nextTick();

			if (options?.cpExecFileError !== undefined) {
				return Promise.reject(options.cpExecFileError);
			}

			return {
				stdout: options?.cpExecFileOutput ?? "",
				stderr: "",
			};
		},
		...overrides,
	};

	return dependencies;
}

export default mockDependencies;
