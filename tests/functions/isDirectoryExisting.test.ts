import { expect, test } from "vite-plus/test";

import isDirectoryExisting from "../../src/functions/isDirectoryExisting.ts";
import mockDependencies from "../__helpers__/mockDependencies.ts";

test("directory exists", async () => {
	const dependencies = mockDependencies({
		fsAccess: async () => Promise.resolve(),
	});

	await expect(isDirectoryExisting("/exists", dependencies)).resolves.toBe(true);
});

test("directory does not exists", async () => {
	const dependencies = mockDependencies({
		fsAccess: async () => Promise.reject(new Error("File does not exists")),
	});

	await expect(isDirectoryExisting("/does-not-exists", dependencies)).resolves.toBe(false);
});
