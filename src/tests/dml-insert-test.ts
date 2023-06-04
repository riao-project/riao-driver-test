import 'jasmine';
import { ColumnType, Database, QueryRepository } from 'riao-dbal/src';
import { TestOptions } from '../test-options';
import { getDatabase } from '../init';

interface User {
	myid: number;
	fname: string;
}

export const dmlInsertTest = (options: TestOptions) =>
	describe(options.name + ' Insert', () => {
		let db: Database;
		let users: QueryRepository<User>;

		beforeAll(async () => {
			db = await getDatabase(options);

			await db.ddl.dropTable({
				tables: 'insert_test',
				ifExists: true,
			});

			await db.ddl.createTable({
				name: 'insert_test',
				columns: [
					{
						name: 'myid',
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

			await db.buildSchema();
			const schema = await db.getSchema();

			if (Object.keys(schema.tables).length < 1) {
				throw new Error('Schema has 0 tables');
			}

			users = db.getQueryRepository<User>({ table: 'insert_test' });
		});

		it('can insert rows', async () => {
			let results = await users.insert({
				records: [
					{
						fname: 'Test',
					},
				],
			});

			expect(+results[0].myid).toEqual(1);

			results = await users.insert({
				records: [
					{
						fname: 'Bob',
					},
					{
						fname: 'Tom',
					},
				],
			});

			expect(+results[0].myid).toEqual(2);

			// Note: This does not work in mysql! vvv
			//expect(+results[1].myid).toEqual(3);
		});
	});
