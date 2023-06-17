import 'jasmine';
import { ColumnType, CreateTableOptions, Database } from 'riao-dbal/src';
import { TestDependencies } from '../dependency-injection';
import { TestOptions } from '../test-options';
import { getDatabase } from '../init';

export const ddlGrantTest = (di: TestDependencies) =>
	describe('Grant', () => {
		let db: Database;
		const options: TestOptions = di.options();

		const name = options.name.toLowerCase();

		if (!name.includes('mysql') && !name.includes('mssql')) {
			it('feature unsupported', () => {});
			return;
		}

		beforeAll(async () => {
			db = di.db();

			await db.ddl.dropUser({
				names: [
					'grant_all_all_test',
					'grant_all_one_test',
					'grant_some_one_test',
				],
				ifExists: true,
			});

			await db.ddl.dropDatabase({
				name: 'grant_all_all_testdb',
				ifExists: true,
			});

			await db.ddl.dropDatabase({
				name: 'grant_all_one_testdb',
				ifExists: true,
			});

			await db.ddl.dropDatabase({
				name: 'grant_some_one_testdb',
				ifExists: true,
			});
		});

		it('can grant all privileges to all databases', async () => {
			await db.ddl.createUser({
				name: 'grant_all_all_test',
				password: 'SomePassword!234',
			});

			await db.ddl.createDatabase({
				name: 'grant_all_all_testdb',
			});

			await db.ddl.grant({
				privileges: 'ALL',
				on: '*',
				to: 'grant_all_all_test',
			});
		});

		it('can grant all privileges to one database', async () => {
			await db.ddl.createDatabase({
				name: 'grant_all_one_testdb',
			});

			const testDb = await getDatabase(
				{
					...options,
					connectionOptions: {
						...options.connectionOptions,
						database: 'grant_all_one_testdb',
					},
				},
				false
			);

			await testDb.ddl.createUser({
				name: 'grant_all_one_test',
				password: 'SomePassword!234',
			});

			await testDb.ddl.grant({
				privileges: 'ALL',
				on: { database: 'grant_all_one_testdb' },
				to: 'grant_all_one_test',
			});
		});

		it('can grant some privileges', async () => {
			await db.ddl.createDatabase({
				name: 'grant_some_one_testdb',
			});

			const testDb = await getDatabase(
				{
					...options,
					connectionOptions: {
						...options.connectionOptions,
						database: 'grant_some_one_testdb',
					},
				},
				false
			);

			await testDb.ddl.createUser({
				name: 'grant_some_one_test',
				password: 'SomePassword!234',
			});

			await testDb.ddl.grant({
				privileges: ['INSERT', 'UPDATE'],
				on: { database: 'grant_some_one_testdb' },
				to: 'grant_some_one_test',
			});
		});
	});
