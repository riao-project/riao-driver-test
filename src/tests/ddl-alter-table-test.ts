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
			if (di.options().name.includes('Sqlite')) {
				console.warn(
					'Adding foreign keys to existing tables not supported by database'
				);

				return;
			}

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

		it('can add columns with inline foreign keys', async () => {
			if (di.options().name.includes('Sqlite')) {
				console.warn(
					'Adding foreign keys to existing tables not supported by database'
				);

				return;
			}

			await db.ddl.createTable({
				name: 'add_columns_fk_parent',
				columns: [
					{
						name: 'id',
						type: ColumnType.INT,
						primaryKey: true,
					},
				],
			});

			await db.ddl.createTable({
				name: 'add_columns_fk_child',
				columns: [
					{
						name: 'id',
						type: ColumnType.INT,
					},
				],
			});

			await db.ddl.addColumns({
				table: 'add_columns_fk_child',
				columns: [
					{
						name: 'parent_id',
						type: ColumnType.INT,
						fk: {
							referencesTable: 'add_columns_fk_parent',
							referencesColumn: 'id',
						},
					},
				],
			});
		});

		it('can change columns', async () => {
			if (di.options().name.includes('Sqlite')) {
				console.warn('Alter column not supported by database');

				return;
			}

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
