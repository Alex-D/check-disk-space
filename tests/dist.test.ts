import { expect, expectTypeOf, test } from "vite-plus/test";

import type { Dependencies as _Dependencies } from "../src/types/dependencies.ts";
import type { DiskSpace as _DiskSpace } from "../src/types/diskSpace.ts";
import _InvalidPathError from "../src/errors/invalidPathError.ts";
import _NoMatchError from "../src/errors/noMatchError.ts";

test("exposes checkDiskSpace()", async () => {
	const { checkDiskSpace } = await import("check-disk-space");

	expect(checkDiskSpace).toBeInstanceOf(Function);
	expectTypeOf(checkDiskSpace).parameter(0).toBeString();
	expectTypeOf(checkDiskSpace).returns.resolves.toEqualTypeOf({
		diskPath: "",
		free: 1,
		size: 1,
	});
	await expect(checkDiskSpace(process.platform === "win32" ? "C:" : "/")).resolves.toBeDefined();
});

test("exposes getFirstExistingParentPath()", async () => {
	const { getFirstExistingParentPath } = await import("check-disk-space");

	expectTypeOf(getFirstExistingParentPath).toBeFunction();
	expectTypeOf(getFirstExistingParentPath).parameter(0).toBeString();
	expectTypeOf(getFirstExistingParentPath).returns.resolves.toBeString();
});

test("exposes errors", async () => {
	const { InvalidPathError, NoMatchError } = await import("check-disk-space");
	expectTypeOf(InvalidPathError).toEqualTypeOf<typeof _InvalidPathError>();
	expectTypeOf(NoMatchError).toEqualTypeOf<typeof _NoMatchError>();
});

test("exposes types", async () => {
	type Dependencies = import("check-disk-space").Dependencies;
	type DiskSpace = import("check-disk-space").DiskSpace;
	expectTypeOf<Dependencies>().toEqualTypeOf<_Dependencies>();
	expectTypeOf<DiskSpace>().toEqualTypeOf<_DiskSpace>();
});
