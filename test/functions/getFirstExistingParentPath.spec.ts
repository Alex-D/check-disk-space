import test from 'ava'
import { PathLike } from 'fs'

import getFirstExistingParentPath from '@/src/functions/getFirstExistingParentPath'
import mockDependencies from '@/test/__helpers__/mockDependencies'


test('unix: get first existing parent path', t => {
	const parentPath = '/home/Alex'
	const dependencies = mockDependencies({
		fsExistsSync: (directoryPath: PathLike) => directoryPath === parentPath,
	})

	t.is(getFirstExistingParentPath('/home/Alex/games/Some/Game', dependencies), parentPath)
})

test('unix: get first parent can be the path itself', t => {
	const parentPath = '/home/Alex'
	const dependencies = mockDependencies({
		fsExistsSync: (directoryPath: PathLike) => directoryPath === parentPath,
	})

	t.is(getFirstExistingParentPath(parentPath, dependencies), parentPath)
})
