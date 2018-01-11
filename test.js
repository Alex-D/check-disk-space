'use strict'

import test from 'ava'

const platformFixtures = {
  win32: [
    {
      title: 'Windows XP',
      path: 'D:/a/long/path',
      execOutput: `
          Caption  FreeSpace     Size
          C:       627703808     10725732352
          D:       0             699783168
          E:       25851797504   107496861696
          F:       834660716544  2000396742656
      `,
      result: {
        diskPath: 'D:',
        free: 0,
        size: 699783168
      }
    },
    {
      title: 'Windows 7',
      path: 'C:/blah',
      execOutput: `
          Caption  FreeSpace  Size
          C:     1286164480   34359734272
          D:     1864638464   50925137920
          E:
          F:     77553082368  990202818560
          G:
          L:
      `,
      result: {
        diskPath: 'C:',
        free: 1286164480,
        size: 34359734272
      }
    },
    {
      title: 'Windows 8',
      path: 'D:/MyGames',
      execOutput: `
          Caption  FreeSpace     Size
          C:       498562174976  539028877312
          D:       0             59494400
      `,
      result: {
        diskPath: 'D:',
        free: 0,
        size: 59494400
      }
    },
    {
      title: 'Windows 10',
      path: 'C:/User/toto',
      execOutput: `
          Caption  FreeSpace     Size
          C:       159345410048  171204145152
          D:       0             4001759232
      `,
      result: {
        diskPath: 'C:',
        free: 159345410048,
        size: 171204145152
      }
    }
  ],
  linux: [
    {
      title: 'bananian',
      path: '/dev',
      execOutput: `
          Filesystem     1K-blocks    Used Available Use% Mounted on
          devtmpfs          447624       0    447624   0% /dev
      `,
      result: {
        diskPath: '/dev',
        free: 447624 * 1024,
        size: 447624 * 1024
      }
    },
    {
      title: 'Ubuntu',
      path: '/run/user/1000',
      execOutput: `
          Filesystem     1024-blocks    Used Available Capacity Mounted on
          tmpfs                89884       8     89876       1% /run/user/1000
      `,
      result: {
        diskPath: '/run/user/1000',
        free: 89876 * 1024,
        size: 89884 * 1024
      }
    },
    {
      title: 'Ubuntu: russian locale',
      path: '/media/Games',
      execOutput: `
          Файл.система   1024-блоков Использовано Доступно Вместимость Cмонтировано в
          /dev/sdc         240234168    188729228 39278628         83% /media/Games
      `,
      result: {
        diskPath: '/media/Games',
        free: 39278628 * 1024,
        size: 240234168 * 1024
      }
    }
  ],
  darwin: [
    {
      title: 'macOS',
      path: '/home/jacquie',
      execOutput: `
          Filesystem    1024-blocks     Used Available Capacity  Mounted on
          /dev/disk0s2    145961032 20678788 125026244    15%    /home
      `,
      result: {
        diskPath: '/home',
        free: 125026244 * 1024,
        size: 145961032 * 1024
      }
    }
  ]
}

function mockCheckDiskSpace(platform, fixture) {
  // Clean some required paths
  delete require.cache[require.resolve('./')]

  // Forces the platform for test purposes
  Object.defineProperty(process, 'platform', {value: platform})

  // Mock child_process.exec
  require('child_process').exec = (cmd, callback) => {
    process.nextTick(() => {
      callback(fixture.execError, fixture.execOutput)
    })
  }

  return require('./')
}

function mockGetFirstExistingParentPath(existingDirectoryPath) {
  // Clean some required paths
  delete require.cache[require.resolve('./')]

  // Forces the platform for test purposes
  Object.defineProperty(process, 'platform', {value: 'linux'})

  // Mock child_process.exec
  require('fs').existsSync = directoryPath => directoryPath === existingDirectoryPath

  return require('./').getFirstExistingParentPath
}

Object.keys(platformFixtures).forEach(platform => {
  platformFixtures[platform].forEach(fixture => {
    test(`${platform}: ${fixture.title}`, async t => {
      const checkDiskSpace = mockCheckDiskSpace(platform, fixture)

      t.deepEqual(await checkDiskSpace(fixture.path), fixture.result)
    })
  })
})

test(`win32: path did not match any disk`, async t => {
  const checkDiskSpace = mockCheckDiskSpace('win32', platformFixtures.win32[0])
  const error = await t.throws(checkDiskSpace('Z:/shouldfail'))
  t.is(error.name, 'NoMatchError')
})

test(`win32: invalid path`, async t => {
  const checkDiskSpace = mockCheckDiskSpace('win32', platformFixtures.win32[0])
  const error = await t.throws(checkDiskSpace('an invalid path'))
  t.is(error.name, 'InvalidPathError')
})

test(`unix: invalid path`, async t => {
  const checkDiskSpace = mockCheckDiskSpace('linux', platformFixtures.linux[0])
  const error = await t.throws(checkDiskSpace('an invalid path'))
  t.is(error.name, 'InvalidPathError')
})

test(`exec has an error`, async t => {
  const fixture = JSON.parse(JSON.stringify(platformFixtures.win32[0]))
  fixture.execError = new Error('some error')

  const checkDiskSpace = mockCheckDiskSpace('win32', fixture)
  const error = await t.throws(checkDiskSpace('C:/something'))
  t.is(error.message, 'some error')
})

test(`unix: get first existing parent path`, t => {
  const parentPath = '/home/Lisa'
  const getFirstExistingParentPath = mockGetFirstExistingParentPath(parentPath)
  t.is(getFirstExistingParentPath('/home/Lisa/games/Ankama/Dofus'), parentPath)
})

test(`unix: get first parent can be the path itself`, t => {
  const parentPath = '/home/Lisa'
  const getFirstExistingParentPath = mockGetFirstExistingParentPath(parentPath)
  t.is(getFirstExistingParentPath(parentPath), parentPath)
})
