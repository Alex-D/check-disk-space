/**
 * `free` and `size` are in bytes
 */
type DiskSpace = {
	diskPath: string
	free: number
	size: number
}

export default DiskSpace
