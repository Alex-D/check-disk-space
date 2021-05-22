# Check disk space

[![Travis](https://img.shields.io/travis/Alex-D/check-disk-space.svg)](https://travis-ci.org/Alex-D/check-disk-space)
[![License MIT](https://img.shields.io/github/license/Alex-D/check-disk-space.svg)](LICENSE)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

## Install

`npm install check-disk-space`

## Usage

```js
// ES
import checkDiskSpace from 'check-disk-space'

// CommonJS
const checkDiskSpace = require('check-disk-space').default

// On Windows
checkDiskSpace('C:/blabla/bla').then((diskSpace) => {
    console.log(diskSpace)
    // {
    //     diskPath: 'C:',
    //     free: 12345678,
    //     size: 98756432
    // }
})

// On Linux or macOS
checkDiskSpace('/mnt/mygames').then((diskSpace) => {
    console.log(diskSpace)
    // {
    //     diskPath: '/',
    //     free: 12345678,
    //     size: 98756432
    // }
})
```
