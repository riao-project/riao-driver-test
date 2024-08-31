export function expectDate(options: {
	expected: Date;
	result: Date;
	toleranceSeconds: number;
	context?: string;
}) {
	expect(options.result).toBeDefined();

	if (typeof options.result === 'string') {
		console.warn(
			'Expected date to be returned as a Date object, but received string'
		);

		options.result = new Date(options.result + 'Z');
	}

	const diff = Math.abs(
		Math.floor(
			(options.expected.getTime() - options.result.getTime()) / 1000
		)
	);

	expect(diff)
		.withContext(
			(options.context ? options.context + ' - ' : '') +
				'Expected result ' +
				`"${options.result.toUTCString()}"` +
				' to be within ' +
				options.toleranceSeconds +
				` seconds of "${options.expected.toUTCString()}"`
		)
		.toBeLessThanOrEqual(options.toleranceSeconds);
}
