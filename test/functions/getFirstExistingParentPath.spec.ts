import test from 'ava'
import { PathLike } from 'fs'

import getFirstExistingParentPath from '@/src/functions/getFirstExistingParentPath'
import mockDependencies from '@/test/__helpers__/mockDependencies'


test('unix: get first existing parent path', async t => {
	const parentPath = '/home/Alex'
	const dependencies = mockDependencies({
		fsAccess: async (directoryPath: PathLike) => directoryPath === parentPath ? Promise.resolve() : Promise.reject(new Error('File does not exists')),
	})

	t.is(await getFirstExistingParentPath('/home/Alex/games/Some/Game', dependencies), parentPath)
})

test('unix: get first parent can be the path itself', async t => {
	const parentPath = '/home/Alex'
	const dependencies = mockDependencies({
		fsAccess: async (directoryPath: PathLike) => directoryPath === parentPath ? Promise.resolve() : Promise.reject(new Error('File does not exists')),
	})

	t.is(await getFirstExistingParentPath(parentPath, dependencies), parentPath)
})
