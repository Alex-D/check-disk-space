import test from 'ava'

import hasPowerShell3 from '@/src/functions/hasPowerShell3'
import mockDependencies from '@/test/__helpers__/mockDependencies'


test('windows: release <=6 must NOT have PowerShell 3', t => {
	const dependencies = mockDependencies({
		platform: 'win32',
	})

	t.is(hasPowerShell3({
		...dependencies,
		release: '5.0.12',
	}), false)

	t.is(hasPowerShell3({
		...dependencies,
		release: '6.1.0',
	}), false)
})

test('windows: release 7+ must have PowerShell 3', t => {
	const dependencies = mockDependencies({
		platform: 'win32',
	})

	t.is(hasPowerShell3({
		...dependencies,
		release: '7.3.15',
	}), true)

	t.is(hasPowerShell3({
		...dependencies,
		release: '10.3.15',
	}), true)

	t.is(hasPowerShell3({
		...dependencies,
		release: '11.14.0',
	}), true)
})

test('windows: release 7+ powershell ENOENT', t => {
	const dependencies = mockDependencies({
		platform: 'win32',
		release: '11.14.0',
	}, {
		cpExecFileSyncError: new Error('ENOENT'),
	})

	t.is(hasPowerShell3(dependencies), false)
})
