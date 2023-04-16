import 'jasmine';
import { Database } from 'riao-dbal/src';
import { TestOptions } from './test-options';
import { getDatabase } from './init';

export const ddlCreateDatabaseTest = (options: TestOptions) =>
	describe(options.name + ' Create Database', () => {
		let db: Database;

		beforeAll(async () => {
			db = await getDatabase(options);

			await db.ddl.dropDatabase({
				name: 'create_db_test',
				ifExists: true,
			});
		});

		it('can create a database', async () => {
			await db.ddl.createDatabase({
				name: 'create_db_test',
			});
		});
	});
