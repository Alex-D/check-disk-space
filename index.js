'use strict'

const {exec} = require('child_process')
const fs = require('fs')
const path = require('path')
const util = require('util')

// Create some errors
const InvalidPathError = function (message) {
  Error.captureStackTrace(this, this.constructor)
  this.name = 'InvalidPathError'
  this.message = message || ''
}
util.inherits(InvalidPathError, Error)

const NoMatchError = function (message) {
  Error.captureStackTrace(this, this.constructor)
  this.name = 'NoMatchError'
  this.message = message || ''
}
util.inherits(NoMatchError, Error)

/**
 * Maps command output to a normalized object {free, size}
 *
 * @param {String} stdout - The command output
 * @param {Function} filter - To filter drives (only used for win32)
 * @param {Object} mapping - Map between column index and normalized column name
 * @param {Number} coefficient - The size coefficient to get bytes instead of kB
 * @return {Object} - {free, size} normalized object
 */
function mapOutput(stdout, filter, mapping, coefficient = 1) {
  const parsed = stdout.trim().split('\n').slice(1).map(line => {
    return line.trim().split(/\s+(?=[\d/])/)
  })

  let filtered = parsed.filter(filter)

  if (filtered.length === 0) {
    throw new NoMatchError()
  }
  filtered = filtered[0]

  return {
    diskPath: filtered[mapping.diskPath],
    free: parseInt(filtered[mapping.free], 10) * coefficient,
    size: parseInt(filtered[mapping.size], 10) * coefficient
  }
}

/**
 * Run the command and do common things between win32 and unix
 *
 * @param {String} cmd - The command to execute
 * @param {Function} filter - To filter drives (only used for win32)
 * @param {Object} mapping - Map between column index and normalized column name
 * @param {Number} coefficient - The size coefficient to get bytes instead of kB
 * @return {Promise} -
 */
function check(cmd, filter, mapping, coefficient = 1) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout) => {
      if (error) {
        reject(error)
      }

      try {
        resolve(mapOutput(stdout, filter, mapping, coefficient))
      } catch (err) {
        reject(err)
      }
    })
  })
}

/**
 * Build the check call for win32
 *
 * @param {String} directoryPath - The file/folder path from where we want to know disk space
 * @return {Promise} -
 */
function checkWin32(directoryPath) {
  if (directoryPath.charAt(1) !== ':') {
    return new Promise((resolve, reject) => {
      reject(new InvalidPathError(`The following path is invalid (should be X:\\...): ${directoryPath}`))
    })
  }

  return check(
    `wmic logicaldisk get size,freespace,caption`,
    driveData => {
      // Only get the drive which match the path
      const driveLetter = driveData[0]
      return directoryPath.startsWith(driveLetter)
    },
    {
      diskPath: 0,
      free: 1,
      size: 2
    }
  )
}

/**
 * Build the check call for unix
 *
 * @param {String} directoryPath - The file/folder path from where we want to know disk space
 * @return {Promise} -
 */
function checkUnix(directoryPath) {
  if (!path.normalize(directoryPath).startsWith(path.sep)) {
    return new Promise((resolve, reject) => {
      reject(new InvalidPathError(`The following path is invalid (should start by ${path.sep}): ${directoryPath}`))
    })
  }

  return check(
    `df -Pk "${module.exports.getFirstExistingParentPath(directoryPath)}"`,
    () => true, // We should only get one line, so we did not need to filter
    {
      diskPath: 5,
      free: 3,
      size: 1
    },
    1024 // We get sizes in kB, we need to convert that to bytes
  )
}

// Inject the right check depending on the OS
module.exports = (process.platform === 'win32') ? checkWin32 : checkUnix

/**
 * Get the first existing parent path
 *
 * @param directoryPath
 * @returns {*}
 */
module.exports.getFirstExistingParentPath = directoryPath => {
  let parentDirectoryPath = directoryPath
  let parentDirectoryFound = fs.existsSync(parentDirectoryPath)

  while (!parentDirectoryFound) {
    parentDirectoryPath = path.normalize(parentDirectoryPath + '/..')
    parentDirectoryFound = fs.existsSync(parentDirectoryPath)
  }

  return parentDirectoryPath
}

module.exports.InvalidPathError = InvalidPathError
module.exports.NoMatchError = NoMatchError
