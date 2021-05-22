/**
 * @public
 */
class NoMatchError extends Error {
	name = 'NoMatchError'

	constructor(message?: string) {
		super(message)
		// Set the prototype explicitly.
		Object.setPrototypeOf(this, NoMatchError.prototype)
	}
}

export default NoMatchError
