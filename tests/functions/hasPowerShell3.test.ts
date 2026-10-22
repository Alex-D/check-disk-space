import { expect, test } from "vite-plus/test";

import hasPowerShell3 from "../../src/functions/hasPowerShell3.ts";
import mockDependencies from "../__helpers__/mockDependencies.ts";

test("windows: release <=6 must NOT have PowerShell 3", async () => {
	const dependencies = mockDependencies({
		platform: "win32",
	});

	await expect(
		hasPowerShell3({
			...dependencies,
			release: "5.0.12",
		}),
	).resolves.toBe(false);

	await expect(
		hasPowerShell3({
			...dependencies,
			release: "6.1.0",
		}),
	).resolves.toBe(false);
});

test("windows: release 7+ must have PowerShell 3", async () => {
	const dependencies = mockDependencies({
		platform: "win32",
	});

	await expect(
		hasPowerShell3({
			...dependencies,
			release: "7.3.15",
		}),
	).resolves.toBe(true);

	await expect(
		hasPowerShell3({
			...dependencies,
			release: "10.3.15",
		}),
	).resolves.toBe(true);

	await expect(
		hasPowerShell3({
			...dependencies,
			release: "11.14.0",
		}),
	).resolves.toBe(true);
});

test("windows: release 7+ powershell ENOENT", async () => {
	const dependencies = mockDependencies(
		{
			platform: "win32",
			release: "11.14.0",
		},
		{
			cpExecFileError: new Error("ENOENT"),
		},
	);

	await expect(hasPowerShell3(dependencies)).resolves.toBe(false);
});
