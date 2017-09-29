# Check disk space

## Install

`npm install check-disk-space`

```js
const checkDiskSpace = require('check-disk-space')

// On Windows
checkDiskSpace('C:/blabla/bla').then((diskSpace) => {
    console.log(diskSpace)
    // {
    //     free: 12345678,
    //     size: 98756432
    // }
})

// On Linux or macOS
checkDiskSpace('/mnt/mygames').then((diskSpace) => {
    console.log(diskSpace)
    // {
    //     free: 12345678,
    //     size: 98756432
    // }
})
```
