import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';

export const ddlAlterTableTest = (di: TestDependencies) =>
	describe('Alter Table', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
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

		it('can add foreign keys', async () => {
			await db.ddl.createTable({
				name: 'alter_fk_test_parent',
				columns: [
					{
						name: 'id',
						type: ColumnType.BIGINT,
						primaryKey: true,
					},
				],
			});

			await db.ddl.createTable({
				name: 'alter_fk_test_child',
				columns: [
					{
						name: 'id',
						type: ColumnType.BIGINT,
					},
					{
						name: 'parent',
						type: ColumnType.BIGINT,
					},
				],
			});

			await db.ddl.addForeignKey({
				table: 'alter_fk_test_child',
				columns: ['parent'],
				referencesTable: 'alter_fk_test_parent',
				referencesColumns: ['id'],
			});
		});

		it('can change columns', async () => {
			await db.ddl.createTable({
				name: 'change_columns_test',
				columns: [
					{
						name: 'id',
						type: ColumnType.INT,
					},
				],
			});

			await db.ddl.changeColumn({
				table: 'change_columns_test',
				column: 'id',
				options: {
					name: 'bigId',
					type: ColumnType.BIGINT,
				},
			});
		});
	});
