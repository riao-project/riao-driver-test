import 'jasmine';
import { ColumnType, Database } from 'riao-dbal/src';
import { TestOptions } from './test-options';
import { getDatabase } from './init';

export const dmlTest = (options: TestOptions) =>
	describe(options.name + ' Query', () => {
		let db: Database;

		beforeAll(async () => {
			db = await getDatabase(options);

			await db.ddl.dropTable({
				names: 'query_test',
				ifExists: true,
			});

			await db.ddl.createTable({
				name: 'query_test',
				columns: [
					{
						name: 'id',
						type: ColumnType.BIGINT,
					},
					{
						name: 'fname',
						type: ColumnType.VARCHAR,
						length: 255,
					},
				],
			});
		});

		it('insert rows', async () => {
			await db.query.insert({
				table: 'query_test',
				records: [
					{
						id: 5,
						fname: 'Test',
					},
				],
			});
		});
	});
