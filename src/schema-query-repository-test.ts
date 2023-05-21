import 'jasmine';
import { ColumnType, Database, SchemaQueryRepository } from 'riao-dbal/src';
import { TestOptions } from './test-options';
import { getDatabase } from './init';

export const schemaQueryRepositoryTest = (options: TestOptions) =>
	describe(options.name + ' Schema Query Repository', () => {
		let db: Database;
		let repo: SchemaQueryRepository;

		beforeAll(async () => {
			db = await getDatabase(options);
			repo = db.getSchemaQueryRepository();

			await db.ddl.dropTable({
				tables: 'schema_query_test',
				ifExists: true,
			});

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

		it('can get information about all tables', async () => {
			const tables = (await repo.getTables()).filter(
				(table) => table.name === 'schema_query_test'
			);

			expect(tables).toEqual(<any>[
				{
					name: 'schema_query_test',
					type: 'table',
					columns: [
						{
							name: 'id',
							type: ColumnType.BIGINT,
							primaryKey: true,
						},
						{
							name: 'fname',
							type: ColumnType.VARCHAR,
							primaryKey: false,
						},
					],
					primaryKey: 'id',
				},
			]);
		});

		it('can get the primary key for a table', async () => {
			const result = await repo.getPrimaryKey({
				table: 'schema_query_test',
			});

			expect(result).toEqual('id');
		});
	});
