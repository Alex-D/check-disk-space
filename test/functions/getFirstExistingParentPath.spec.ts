import { platform } from 'node:os'

import test from 'ava'
import { PathLike } from 'fs'

import getFirstExistingParentPath from '@/src/functions/getFirstExistingParentPath'
import mockDependencies from '@/test/__helpers__/mockDependencies'


const getDependencies = (parentPath: string) => mockDependencies({
	fsAccess: async (directoryPath: PathLike) => directoryPath === parentPath ? Promise.resolve() : Promise.reject(new Error('File does not exists')),
})

const os = platform()
const isWindows = os === 'win32'
const testIf = (condition: boolean) => (condition ? test : test.skip)

testIf(!isWindows)('unix: get first existing parent path', async t => {
	const parentPath = '/home/Alex'
	const dependencies = getDependencies(parentPath)

	t.is(await getFirstExistingParentPath('/home/Alex/games/Some/Game', dependencies), parentPath)
})

testIf(!isWindows)('unix: get first parent can be the path itself', async t => {
	const parentPath = '/home/Alex'
	const dependencies = getDependencies(parentPath)

	t.is(await getFirstExistingParentPath(parentPath, dependencies), parentPath)
})

testIf(isWindows)('win32: Gets parent to C:\\Alex', async t => {
	const parentPath = 'C:\\'
	const dependencies = getDependencies(parentPath)
	t.is(await getFirstExistingParentPath('C:\\Alex', dependencies), parentPath)
})

testIf(isWindows)('win32: Returns root folder when called on root folder', async t => {
	const parentPath = 'C:\\'
	const dependencies = getDependencies(parentPath)
	t.is(await getFirstExistingParentPath(parentPath, dependencies), parentPath)
})

testIf(isWindows)('win32: returns empty string when drive does not exist', async t => {
	const drivePathThatExists = 'C:\\'
	const dependencies = getDependencies(drivePathThatExists)
	const drivePathThatDoesNotExist = 'Z:\\'
	t.is(await getFirstExistingParentPath(drivePathThatDoesNotExist, dependencies), '')
})
