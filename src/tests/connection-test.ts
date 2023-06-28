import 'jasmine';
import { Database } from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';
import { TestOptions } from '../test-options';

export const connectionTest = (di: TestDependencies) =>
	describe('Connection', () => {
		let db: Database;
		let options: TestOptions;

		beforeAll(() => {
			db = di.db();
			options = di.options();
		});

		it('can connect', async () => {
			const connection = new db.driverType();
			await connection.connect(options.connectionOptions);

			expect(connection).toBeTruthy();
		});

		it('can disconnect', async () => {
			const connection = new db.driverType();
			await connection.connect(options.connectionOptions);
			await connection.disconnect();

			expect(connection).toBeTruthy();
		});

		it('can get the version', async () => {
			const connection = new db.driverType();
			await connection.connect(options.connectionOptions);
			const version = await connection.getVersion();

			expect(version)
				.withContext('version test')
				.toMatch(options.expectedVersion);
		});
	});
