class InvalidPathError extends Error {
	name = 'InvalidPathError'

	constructor(message?: string) {
		super(message)
		// Set the prototype explicitly.
		Object.setPrototypeOf(this, InvalidPathError.prototype)
	}
}

export default InvalidPathError
