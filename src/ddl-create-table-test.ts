import 'jasmine';
import { ColumnType, CreateTableOptions, Database } from 'riao-dbal/src';
import { TestOptions } from './test-options';
import { getDatabase } from './init';

export const ddlCreateTableTest = (options: TestOptions) =>
	describe(options.name + ' Data Definition', () => {
		let db: Database;

		beforeAll(async () => {
			db = await getDatabase(options);

			await db.ddl.dropTable({
				names: [
					'create_test',
					'create_pk_test',
					'create_auto_increment_test',
					'create_fk_test_child',
					'create_if_not_exists_test',
				],
				ifExists: true,
			});

			await db.ddl.dropTable({
				names: ['create_fk_test_parent'],
				ifExists: true,
			});
		});

		it('can create a table', async () => {
			await db.ddl.createTable({
				name: 'create_test',
				columns: [
					{
						name: 'id',
						type: ColumnType.BIGINT,
					},
				],
			});
		});

		it('can create a primary key', async () => {
			await db.ddl.createTable({
				name: 'create_pk_test',
				columns: [
					{
						name: 'id',
						type: ColumnType.BIGINT,
						primaryKey: true,
					},
				],
			});
		});

		it('can create an auto-incrementing key', async () => {
			await db.ddl.createTable({
				name: 'create_auto_increment_test',
				columns: [
					{
						name: 'id',
						type: ColumnType.BIGINT,
						primaryKey: true,
						autoIncrement: true,
					},
				],
			});
		});

		it('can create a table w/ foreign keys', async () => {
			await db.ddl.createTable({
				name: 'create_fk_test_parent',
				columns: [
					{
						name: 'id',
						type: ColumnType.BIGINT,
						primaryKey: true,
					},
				],
			});

			await db.ddl.createTable({
				name: 'create_fk_test_child',
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
				foreignKeys: [
					{
						columns: ['parent'],
						referencesTable: 'create_fk_test_parent',
						referencesColumns: ['id'],
					},
				],
			});
		});

		it('can create a table if not exists', async () => {
			const table: CreateTableOptions = {
				name: 'create_if_not_exists_test',
				columns: [
					{
						name: 'id',
						type: ColumnType.BIGINT,
						primaryKey: true,
					},
				],
				ifNotExists: true,
			};

			await db.ddl.createTable(table);
			await db.ddl.createTable(table);
		});
	});
