# Check disk space

[![Continue Integration](https://img.shields.io/github/actions/workflow/status/Alex-D/check-disk-space/ci.yml?style=for-the-badge)](https://github.com/Alex-D/check-disk-space/actions/workflows/ci.yml)
[![check-disk-space on npm](https://img.shields.io/npm/v/check-disk-space?style=for-the-badge)](https://www.npmjs.com/package/check-disk-space)
[![License MIT](https://img.shields.io/github/license/Alex-D/check-disk-space.svg?style=for-the-badge)](LICENSE)

## Introduction

A light multi-platform disk space checker without any third party for Node.js.

- Works on Linux, macOS and Windows
- Take care of mounting points on unix-like systems
- No dependencies
- TypeScript support

## Install

`npm install check-disk-space`

## Usage

```js
import { checkDiskSpace } from "check-disk-space";

let yourPath = "";

// On Windows
yourPath = "C:/your/path";

// On Linux or macOS
yourPath = "/mnt/mydisk";

checkDiskSpace(yourPath).then((diskSpace) => {
	console.log(diskSpace);
	// {
	//     diskPath: 'C:', (or '/')
	//     free: 12345678,
	//     size: 98756432
	// }
	// Note: `free` and `size` are in bytes
});
```

## Compatibility

- Node 18+
