import 'jasmine';
import { ColumnType, Database } from 'riao-dbal/src';
import { TestOptions } from './test-options';
import { getDatabase } from './init';

export const ddlAlterTableTest = (options: TestOptions) =>
	describe(options.name + ' Data Definition', () => {
		let db: Database;

		beforeAll(async () => {
			db = await getDatabase(options);

			await db.ddl.dropTable({
				names: ['add_columns_test'],
				ifExists: true,
			});

			await db.ddl.dropTable({
				names: ['alter_fk_test_parent'],
				ifExists: true,
			});
		});

		it('can add columns', async () => {
			await db.ddl.createTable({
				name: 'add_columns_test',
				columns: [
					{
						name: 'id',
						type: ColumnType.INT,
					},
				],
			});

			await db.ddl.addColumns({
				table: 'add_columns_test',
				columns: [
					{
						name: 'fname',
						type: ColumnType.VARCHAR,
						length: 255,
					},
				],
			});
		});
	});
