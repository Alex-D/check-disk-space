import test from 'ava'

import hasPowerShell3 from '@/src/functions/hasPowerShell3'


test('windows: release <=6 must NOT have PowerShell 3', t => {
	t.is(hasPowerShell3('5.0.12'), false)
	t.is(hasPowerShell3('6.1.0'), false)
})

test('windows: release 7+ must have PowerShell 3', t => {
	t.is(hasPowerShell3('7.3.15'), true)
	t.is(hasPowerShell3('10.3.15'), true)
	t.is(hasPowerShell3('11.14.0'), true)
})
