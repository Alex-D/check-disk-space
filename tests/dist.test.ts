import { expect, test } from "vite-plus/test";

test("check-disk-space", async () => {
	const { checkDiskSpace } = await import("check-disk-space");

	expect(checkDiskSpace).toBe(false);
});
