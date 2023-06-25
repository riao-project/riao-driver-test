export function expectDate(options: {
	expected: Date;
	result: Date;
	toleranceSeconds: number;
	context?: string;
}) {
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
