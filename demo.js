import { checkDiskSpace } from "./dist/check-disk-space.mjs";

const isWindows = process.platform === "win32";

checkDiskSpace(isWindows ? "C:/" : "/").then((diskSpace) => {
	// eslint-disable-next-line no-console
	console.log(diskSpace);
});
