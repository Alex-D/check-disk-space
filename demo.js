const checkDiskSpace = require('./dist/check-disk-space.cjs').default

const isWindows = process.platform === 'win32'

checkDiskSpace(isWindows ? 'C:/' : '/').then((diskSpace) => {
	// eslint-disable-next-line no-console
	console.log(diskSpace)
})
