<h1 align="center">Check disk space</h1>

<p align="center">
    <a href="https://github.com/Alex-D/check-disk-space/actions/workflows/test.yml"><img src="https://img.shields.io/github/actions/workflow/status/Alex-D/check-disk-space/test.yml?style=for-the-badge" alt="Minimized & gzipped size ~1kb" /></a>
    <a href="https://bundlejs.com/?q=check-disk-space"><img src="https://img.shields.io/bundlejs/size/check-disk-space.svg?style=for-the-badge" alt="Minimized & gzipped size ~1kb" /></a>
    <a href="https://npmx.dev/package/check-disk-space"><img src="https://img.shields.io/npm/dm/check-disk-space.svg?color=blue&label=npm%20downloads&style=for-the-badge" alt="Downloads" /></a>
    <a href="https://github.com/Alex-D/check-disk-space/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/check-disk-space.svg?color=blue&style=for-the-badge" alt="MIT Licence" /></a>
</p>

<h2 align="center">Supporting check-disk-space</h2>

`check-disk-space` is an MIT-licensed open source project and completely free to use.
You can support its ongoing development by being a backer or a sponsor:

- [Become a backer or sponsor on Patreon](https://www.patreon.com/alexandredemode)
- [One-time donation via PayPal](https://www.paypal.me/demodealexandre/20eur)

---

## Introduction

A light multi-platform disk space checker without any third party compatible with Node.js, Bun and Deno.

- Works on **Linux**, **macOS** and **Windows**
- Take care of mounting points on unix-like systems
- Zero dependencies
- TypeScript support

## Install

| Package manager | Command                               |
| --------------- | ------------------------------------- |
| Vite+           | `vp add check-disk-space`             |
| pnpm            | `pnpm add check-disk-space`           |
| npm             | `npm install check-disk-space --save` |
| yarn            | `yarn add check-disk-space`           |
| bun             | `bun add check-disk-space`            |
| deno            | `deno add npm:check-disk-space`       |

## Usage

```js
import { checkDiskSpace } from "check-disk-space";
// Or with require
const { checkDiskSpace } = require("check-disk-space");

let yourPath = "";

// On Windows
yourPath = "C:/your/path";

// On Linux or macOS
yourPath = "/mnt/mydisk";

checkDiskSpace(yourPath).then((diskSpace) => {
	console.log(diskSpace);
	// {
	//     diskPath: 'C:', (or '/' on Linux/macOS)
	//     free: 12345678,
	//     size: 98756432
	// }
	// Note: `free` and `size` are in bytes
});
```

### Input

- `directoryPath` (string)
  - Must be a valid path depending on the OS
  - Can be a non-existent directory: the lib will automatically search the first existing parent folder to find the right disk to check

### Output

- `diskPath` (string)
  - on Windows, it's always the disk letter
  - on UNIX like, it depends on the mount path of the disk, so it's not necessarily `'/'`
- `free` (number)
  - in bytes
  - available space on the disk on which the path to check is stored on
- `size` (number)
  - in bytes
  - total size of the disk on which the path to check is stored on

## Migrating from v3.x

Migrates to ESM and does not use `default` export anymore.

```diff
- import checkDiskSpace from "check-disk-space";
+ import { checkDiskSpace } from "check-disk-space";
```

```diff
- const checkDiskSpace = require("check-disk-space").default;
+ import { checkDiskSpace } from "check-disk-space";
```

## Compatibility

All of this is fully tested in the CI.

### Supported engines

- Node 18+
- Bun 1.3+
- Deno 2.5+ (needs `sys`, `read`, `env` and `run` access)

### Operating Systems

- UNIX like, based on the `df` output
  - Linux
  - macOS
- Windows 7+, based on PowerShell 3 or `wmic` depending on the version and user's rights
