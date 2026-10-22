import type { PathLike } from "fs";
import { expect, test } from "vite-plus/test";

import getFirstExistingParentPath from "../../src/functions/getFirstExistingParentPath.ts";
import mockDependencies from "../__helpers__/mockDependencies.ts";
import NoMatchError from "../../src/errors/noMatchError.ts";

test("unix: get first existing parent path", async () => {
	const parentPath = "/home/Alex";
	const dependencies = mockDependencies({
		fsAccess: async (directoryPath: PathLike) =>
			directoryPath === parentPath
				? Promise.resolve()
				: Promise.reject(new Error("File does not exists")),
	});

	await expect(
		getFirstExistingParentPath("/home/Alex/games/Some/Game", dependencies),
	).resolves.toBe(parentPath);
});

test("unix: get first parent can be the path itself", async () => {
	const parentPath = "/home/Alex";
	const dependencies = mockDependencies({
		fsAccess: async (directoryPath: PathLike) =>
			directoryPath === parentPath
				? Promise.resolve()
				: Promise.reject(new Error("File does not exists")),
	});

	await expect(getFirstExistingParentPath(parentPath, dependencies)).resolves.toBe(parentPath);
});

test("win32: get first parent with existing disk letter", async () => {
	const parentPath = "C:/home/Alex";
	const dependencies = mockDependencies({
		platform: "win32",
		fsAccess: async (directoryPath: PathLike) =>
			directoryPath === parentPath
				? Promise.resolve()
				: Promise.reject(new Error("File does not exists")),
	});

	await expect(
		getFirstExistingParentPath("C:/home/Alex/games/Some/Game", dependencies),
	).resolves.toBe(parentPath);
});

test("win32: get first parent with non-existing disk letter", async () => {
	const dependencies = mockDependencies({
		platform: "win32",
		fsAccess: async (_directoryPath: PathLike) => Promise.reject(new Error("File does not exists")),
	});

	await expect(
		getFirstExistingParentPath("Z:/home/Alex/games/Some/Game", dependencies),
	).rejects.toBeInstanceOf(NoMatchError);
});
