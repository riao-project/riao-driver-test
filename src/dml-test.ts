import 'jasmine';
import { ColumnType, DatabaseDriver } from 'riao-dbal/src';
import { TestOptions } from './test-options';

export const dmlTest = (options: TestOptions) =>
	describe(options.name + ' Query', () => {
		let conn: DatabaseDriver;

		beforeAll(async () => {
			conn = new options.driver();
			await conn.connect(options.connectionOptions);
			await conn.query(
				conn.getDataDefinitionBuilder().dropTable({
					names: 'query_test',
					ifExists: true,
				})
			);
			await conn.query(
				conn.getDataDefinitionBuilder().createTable({
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
				})
			);
		});

		afterAll(async () => {
			await conn.disconnect();
		});

		it('insert rows', async () => {
			await conn.query(
				conn.getQueryBuilder().insert({
					table: 'query_test',
					records: [
						{
							id: 5,
							fname: 'Test',
						},
					],
				})
			);
		});
	});
