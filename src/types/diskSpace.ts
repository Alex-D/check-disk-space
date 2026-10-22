/**
 * `free` and `size` are in bytes
 */
export type DiskSpace = {
	diskPath: string;
	free: number;
	size: number;
};
