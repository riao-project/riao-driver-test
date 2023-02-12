import 'jasmine';
import { TestOptions } from './test-options';

export const connectionTest = (options: TestOptions) =>
	describe(options.name + ' Connection', () => {
		it('can connect', async () => {
			const connection = new options.driver();
			await connection.connect(options.connectionOptions);

			expect(connection).toBeTruthy();
		});

		it('can disconnect', async () => {
			const connection = new options.driver();
			await connection.connect(options.connectionOptions);
			await connection.disconnect();

			expect(connection).toBeTruthy();
		});

		it('can get the version', async () => {
			const connection = new options.driver();
			await connection.connect(options.connectionOptions);
			const version = await connection.getVersion();

			expect(version)
				.withContext('version test')
				.toMatch(options.expectedVersion);
		});
	});
