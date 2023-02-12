import 'jasmine';
import { ColumnType, DatabaseDriver } from 'riao-dbal/src';
import { TestOptions } from './test-options';

export const ddlTest = (options: TestOptions) =>
	describe(options.name + ' Data Definition', () => {
		let conn: DatabaseDriver;

		beforeAll(async () => {
			conn = new options.driver();
			await conn.connect(options.connectionOptions);

			await conn.query(
				conn.getDataDefinitionBuilder().dropTable({
					names: ['create_test'],
					ifExists: true,
				})
			);
		});

		afterAll(async () => {
			await conn.disconnect();
		});

		it('can create a table', async () => {
			await conn.query(
				conn.getDataDefinitionBuilder().createTable({
					name: 'create_test',
					columns: [
						{
							name: 'id',
							type: ColumnType.BIGINT,
						},
					],
				})
			);
		});
	});
