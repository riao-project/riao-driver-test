import 'jasmine';
import { ColumnType, Database } from 'riao-dbal/src';
import { TestDependencies } from '../dependency-injection';

export const ddlDropTableTest = (di: TestDependencies) =>
	describe('Drop Table', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
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
