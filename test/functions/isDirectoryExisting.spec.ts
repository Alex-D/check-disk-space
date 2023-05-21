import test from 'ava'

import isDirectoryExisting from '@/src/functions/isDirectoryExisting'
import mockDependencies from '@/test/__helpers__/mockDependencies'


test('directory exists', async t => {
	const dependencies = mockDependencies({
		fsAccess: async () => Promise.resolve(),
	})

	t.is(await isDirectoryExisting('/exists', dependencies), true)
})

test('directory does not exists', async t => {
	const dependencies = mockDependencies({
		fsAccess: async () => Promise.reject(new Error('File does not exists')),
	})

	t.is(await isDirectoryExisting('/does-not-exists', dependencies), false)
})
