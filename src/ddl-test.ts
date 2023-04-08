import 'jasmine';
import { ColumnType, Database } from 'riao-dbal/src';
import { TestOptions } from './test-options';
import { getDatabase } from './init';

export const ddlTest = (options: TestOptions) =>
	describe(options.name + ' Data Definition', () => {
		let db: Database;

		beforeAll(async () => {
			db = await getDatabase(options);

			await db.ddl.dropTable({
				names: [
					'create_test',
					'create_pk_test',
					'create_auto_increment_test',
				],
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
	});
