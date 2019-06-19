declare module "check-disk-space" {
  namespace checkDiskSpace {
    /**
     * The result of the disk space check
     */
    interface CheckDiskSpaceResult {
      /**
       * How much space is left
       */
      free: number;
      /**
       * The size of the path
       */
      size: number;
    }

    /**
     * Error for invalid path
     */
    class InvalidPathError {
      constructor(message: string);
      /**
       * The name of the error
       */
      name: "InvalidPathError";
      /**
       * The error message
       */
      message: string | "";
    }

    /**
     * Error for path which do not match the actual file system
     */
    class NoMatchError {
      constructor(message: any);
      /**
       * The name of the error
       */
      name: "NoMatchError";
      /**
       * The error message
       */
      message: string | "";
    }

    /**
     * Get the first existing parent path
     *
     * @param {string} directoryPath The file/folder path from where we want to know disk space
     * @returns {string} The first existing parent path
     */
    function getFirstExistingParentPath(directoryPath: string): string;
  }

  /**
   * Build the check call for unix or win32
   *
   * @param {string} directoryPath The file/folder path from where we want to know disk space
   * @return {Promise<CheckDiskSpaceResult>} The result of the check
   *
   * @example
   * // On Windows
   * const diskSpace = await checkDiskSpace('C:/blabla/bla');
   * console.log(diskSpace); // { free: 12345678, size: 98756432 }
   *
   * @example
   * const diskSpace = await checkDiskSpace('/mnt/mygames');
   * console.log(diskSpace); // { free: 12345678, size: 98756432 }
   *
   * @throws {NoMatchError} In case the given path does not match with the actual file system
   * @throws {InvalidPathError} In case the path is invalid
   */
  function checkDiskSpace(directoryPath: string): Promise<checkDiskSpace.CheckDiskSpaceResult>;

  export = checkDiskSpace;
}
