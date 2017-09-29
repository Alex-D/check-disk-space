'use strict';

const {exec} = require('child_process')

/**
 * Maps command output to a normalized object {free, size}
 *
 * @param {String} stdout - The command output
 * @param {Function} filter - To filter drives (only used for win32)
 * @param {Object} mapping - Map between column index and normalized column name
 * @return {Object} - {free, size} normolized object
 */
function mapOutput(stdout, filter, mapping, coefficient = 1) {
    const parsed = stdout.trim().split('\n').slice(1).map(line => {
        return line.trim().split(/\s+(?=[\d\/])/)
    })

    let filtered = parsed.filter(filter)

    if (filtered.length === 0) {
        throw new Error('Path did not match any drive')
    }
    filtered = filtered[0]

    return {
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
 * @param {String} path - The file/folder path from where we want to know disk space
 * @return {Promise}
 */
function check(cmd, filter, mapping, path) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout) => {
            if (error) {
                reject(error)
            }

            try {
                resolve(mapOutput(stdout, filter, mapping))
            } catch (e) {
                reject(e)
            }
        })
    })
}

/**
 * Build the check call for win32
 *
 * @param {String} path - The file/folder path from where we want to know disk space
 * @return {Promise}
 */
function checkWin32(path) {
    return check(
        `wmic logicaldisk get size,freespace,caption`,
        (driveData) => {
            // Only get the drive which match the path
            const driveLetter = driveData[0]
            return path.startsWith(driveLetter)
        },
        {
            free: 1,
            size: 2
        }
    )
}

/**
 * Build the check call for unix
 *
 * @param {String} path - The file/folder path from where we want to know disk space
 * @return {Promise}
 */
function checkUnix(path) {
    return check(
        `df -Pk ${path}`,
        (driveData) => true, // We should only get one line, so we did not need to filter
        {
            free: 3,
            size: 1
        },
        1024 // We get sizes in kB, we need to convert that to bytes
    )
}

// Inject the right check depending on the OS
module.exports = (process.platform === 'win32') ? checkWin32 : checkUnix
