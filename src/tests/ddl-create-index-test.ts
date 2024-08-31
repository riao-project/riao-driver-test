import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';

export const ddlCreateIndexTest = (di: TestDependencies) =>
	describe('Create Index', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
		});

		it('can create an index', async () => {
			await db.ddl.createTable({
				name: 'create_index_test',
				columns: [
					{
						name: 'id',
						type: ColumnType.INT,
					},
					{
						name: 'user_id',
						type: ColumnType.INT,
					},
				],
			});

			await db.ddl.createIndex({
				table: 'create_index_test',
				column: 'user_id',
			});
		});
	});
