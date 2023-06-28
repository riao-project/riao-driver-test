import 'jasmine';
import { ColumnType, Database, SchemaQueryRepository } from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';

export const schemaQueryRepositoryTest = (di: TestDependencies) =>
	describe('Schema Query Repository', () => {
		let db: Database;
		let repo: SchemaQueryRepository;

		beforeAll(async () => {
			db = di.db();
			repo = db.getSchemaQueryRepository();

			await db.ddl.createTable({
				name: 'schema_query_test',
				columns: [
					{
						name: 'id',
						type: ColumnType.BIGINT,
						primaryKey: true,
						autoIncrement: true,
					},
					{
						name: 'fname',
						type: ColumnType.VARCHAR,
						length: 255,
					},
				],
			});
		});

		it('can get schema information', async () => {
			const schema = await repo.getSchema();

			for (const key in schema.tables) {
				if (key !== 'schema_query_test') {
					delete schema.tables[key];
				}
			}

			expect(schema as any).toEqual({
				tables: {
					schema_query_test: {
						name: 'schema_query_test',
						type: 'table',
						columns: {
							id: {
								name: 'id',
								type: ColumnType.BIGINT,
								primaryKey: true,
							},
							fname: {
								name: 'fname',
								type: ColumnType.VARCHAR,
								primaryKey: false,
								//length: 255,
							},
						},
						primaryKey: 'id',
					},
				},
			});
		});

		it('can get the primary key for a table', async () => {
			const result = await repo.getPrimaryKeyName({
				table: 'schema_query_test',
			});

			expect(result).toEqual('id');
		});
	});
