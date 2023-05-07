import 'jasmine';
import { ColumnType, Database } from 'riao-dbal/src';
import { TestOptions } from './test-options';
import { getDatabase } from './init';

export const ddlDropTableTest = (options: TestOptions) =>
	describe(options.name + ' Drop Table', () => {
		let db: Database;

		beforeAll(async () => {
			db = await getDatabase(options);
		});

		it('can drop a table', async () => {
			await db.ddl.createTable({
				name: 'drop_test',
				ifNotExists: true,
				columns: [
					{
						name: 'id',
						type: ColumnType.INT,
					},
				],
			});

			await db.ddl.dropTable({
				tables: ['drop_test'],
			});
		});
	});
