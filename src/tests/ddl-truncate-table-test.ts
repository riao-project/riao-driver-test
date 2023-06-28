import 'jasmine';
import { ColumnType, CreateTableOptions, Database } from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';

export const ddlTruncateTableTest = (di: TestDependencies) =>
	describe('Truncate', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
		});

		it('can truncate a table', async () => {
			await db.ddl.createTable({
				name: 'truncate_test',
				ifNotExists: true,
				columns: [
					{
						name: 'id',
						type: ColumnType.INT,
					},
				],
			});

			await db.query.insert({
				table: 'truncate_test',
				records: [{ id: 1 }],
			});

			await db.ddl.truncate({
				table: 'truncate_test',
			});
		});
	});
