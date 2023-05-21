'use strict'

import test from 'ava'

import checkDiskSpace from '@/src/index'
import mockDependencies from '@/test/__helpers__/mockDependencies'

const platformFixtures = {
	win32: [
		{
			title: 'Windows XP',
			release: '4.0.42',
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
				size: 699783168,
			},
		},
		{
			title: 'Windows 7',
			release: '6.42.24',
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
				size: 34359734272,
			},
		},
		{
			title: 'Windows 8',
			release: '8.12.4',
			path: 'D:/MyGames',
			execOutput: `
          Caption  FreeSpace     Size
          C:       498562174976  539028877312
          D:       0             59494400
      `,
			result: {
				diskPath: 'D:',
				free: 0,
				size: 59494400,
			},
		},
		{
			title: 'Windows 10',
			release: '10.42.0',
			path: 'C:/User/toto',
			execOutput: `
          Caption  FreeSpace     Size
          C:       159345410048  171204145152
          D:       0             4001759232
      `,
			result: {
				diskPath: 'C:',
				free: 159345410048,
				size: 171204145152,
			},
		},
		{
			title: 'Windows 11: With strange Powershell settings #23',
			release: '11.12.0',
			path: 'C:/User/toto',
			execOutput: `

          Caption  FreeSpace     Size

          C:       159345410048  171204145152

          D:       0             4001759232

      `,
			result: {
				diskPath: 'C:',
				free: 159345410048,
				size: 171204145152,
			},
		},
	],
	linux: [
		{
			title: 'bananian',
			release: '5.1.0',
			path: '/dev',
			execOutput: `
          Filesystem     1K-blocks    Used Available Use% Mounted on
          devtmpfs          447624       0    447624   0% /dev
      `,
			result: {
				diskPath: '/dev',
				free: 447624 * 1024,
				size: 447624 * 1024,
			},
		},
		{
			title: 'Ubuntu',
			release: '5.1.0',
			path: '/run/user/1000',
			execOutput: `
          Filesystem     1024-blocks    Used Available Capacity Mounted on
          tmpfs                89884       8     89876       1% /run/user/1000
      `,
			result: {
				diskPath: '/run/user/1000',
				free: 89876 * 1024,
				size: 89884 * 1024,
			},
		},
		{
			title: 'Ubuntu: russian locale',
			release: '5.1.0',
			path: '/media/Games',
			execOutput: `
          Файл.система   1024-блоков Использовано Доступно Вместимость Cмонтировано в
          /dev/sdc         240234168    188729228 39278628         83% /media/Games
      `,
			result: {
				diskPath: '/media/Games',
				free: 39278628 * 1024,
				size: 240234168 * 1024,
			},
		},
	],
	darwin: [
		{
			title: 'macOS',
			release: '5.1.0',
			path: '/home/jacquie',
			execOutput: `
          Filesystem    1024-blocks     Used Available Capacity  Mounted on
          /dev/disk0s2    145961032 20678788 125026244    15%    /home
      `,
			result: {
				diskPath: '/home',
				free: 125026244 * 1024,
				size: 145961032 * 1024,
			},
		},
	],
}

type Platform = keyof typeof platformFixtures
const platforms = Object.keys(platformFixtures) as Platform[]
platforms.forEach(platform => {
	platformFixtures[platform].forEach(fixture => {
		test(`${platform}: ${fixture.title}`, async t => {
			const dependencies = mockDependencies({
				platform,
				release: fixture.release,
			}, {
				cpExecFileOutput: fixture.execOutput,
			})
			t.deepEqual(await checkDiskSpace(fixture.path, dependencies), fixture.result)
		})
	})
})

test('win32: path did not match any disk', async t => {
	const dependencies = mockDependencies({
		platform: 'win32',
	}, {
		cpExecFileOutput: platformFixtures.win32[0].execOutput,
	})

	const error = await t.throwsAsync(checkDiskSpace('Z:/shouldfail', dependencies))
	t.is(error?.name, 'NoMatchError')
})

test('win32: invalid path', async t => {
	const dependencies = mockDependencies({
		platform: 'win32',
	}, {
		cpExecFileOutput: platformFixtures.win32[0].execOutput,
	})

	const error = await t.throwsAsync(checkDiskSpace('an invalid path', dependencies))
	t.is(error?.name, 'InvalidPathError')
})

test('unix: invalid path', async t => {
	const dependencies = mockDependencies({
		platform: 'linux',
	}, {
		cpExecFileOutput: platformFixtures.linux[0].execOutput,
	})

	const error = await t.throwsAsync(checkDiskSpace('an invalid path', dependencies))
	t.is(error?.name, 'InvalidPathError')
})

test('exec has an error', async t => {
	const dependencies = mockDependencies({
		platform: 'win32',
	}, {
		cpExecFileError: new Error('some error'),
	})

	const error = await t.throwsAsync(checkDiskSpace('C:/something', dependencies))
	t.is(error?.message, 'some error')
})

test('run without dependencies mock', async t => {
	await t.notThrowsAsync(checkDiskSpace(process.platform === 'linux' ? '/' : 'C:'))
})
