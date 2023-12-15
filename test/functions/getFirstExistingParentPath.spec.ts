import test from 'ava'
import { PathLike } from 'fs'

import getFirstExistingParentPath from '@/src/functions/getFirstExistingParentPath'
import mockDependencies from '@/test/__helpers__/mockDependencies'

const getDependencies = (parentPath: string) => mockDependencies({
	fsAccess: async (directoryPath: PathLike) => directoryPath === parentPath ? Promise.resolve() : Promise.reject(new Error('File does not exists')),
})

test('unix: get first existing parent path', async t => {
	const parentPath = '/home/Alex'
	const dependencies = getDependencies(parentPath)

	t.is(await getFirstExistingParentPath('/home/Alex/games/Some/Game', dependencies), parentPath)
})

test('unix: get first parent can be the path itself', async t => {
	const parentPath = '/home/Alex'
	const dependencies = getDependencies(parentPath)

	t.is(await getFirstExistingParentPath(parentPath, dependencies), parentPath)
})

test('unix: get first parent of root is root', async t => {
	const parentPath = '/'
	const dependencies = getDependencies(parentPath)

	t.is(await getFirstExistingParentPath(parentPath, dependencies), parentPath)
})

test('win32: Gets parent to C:\\Alex', async t => {
	// note that 'C:/' will fail on UNIX os's as normalize(C:/Alex/..) = C: not C:/
	const parentPath = 'C:'
	const dependencies = getDependencies(parentPath)
	t.is(await getFirstExistingParentPath('C:/Alex', dependencies), parentPath)
})

test('win32: Returns root folder when called on root folder', async t => {
	const parentPath = 'C:/'
	const dependencies = getDependencies(parentPath)
	t.is(await getFirstExistingParentPath(parentPath, dependencies), parentPath)
})

test('win32: returns empty string when drive does not exist', async t => {
	const drivePathThatExists = 'C:/'
	const dependencies = getDependencies(drivePathThatExists)
	const drivePathThatDoesNotExist = 'Z:/'
	t.is(await getFirstExistingParentPath(drivePathThatDoesNotExist, dependencies), '')
})
