import 'jasmine';
import { ColumnType, CreateTableOptions, Database } from 'riao-dbal/src';
import { TestOptions } from './test-options';
import { getDatabase } from './init';

export const ddlTruncateTableTest = (options: TestOptions) =>
	describe(options.name + ' Truncate', () => {
		let db: Database;

		beforeAll(async () => {
			db = await getDatabase(options);
		});

		it('can truncate a table', async () => {
			await db.ddl.createTable({
				name: 'truncate_test',
				ifNotExists: true,
				columns: [
					{
						name: 'id',
						type: ColumnType.INT,
					},
				],
			});

			await db.query.insert({
				table: 'truncate_test',
				records: [{ id: 1 }],
			});

			await db.ddl.truncate({
				table: 'truncate_test',
			});
		});
	});