import 'jasmine';
import { TestDependencies } from '../dependency-injection';
import { Database } from '@riao/dbal';

export const ddlCreateDatabaseTest = (di: TestDependencies) =>
	describe('Create Database', () => {
		let db: Database;

		beforeAll(async () => {
			db = di.db();

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
