import 'jasmine';
import { ColumnType, Database, QueryRepository } from 'riao-dbal/src';
import { TestOptions } from './test-options';
import { getDatabase } from './init';

interface User {
	myid: number;
	fname: string;
}

export const dmlUpdateTest = (options: TestOptions) =>
	describe(options.name + ' Update', () => {
		let db: Database;
		let users: QueryRepository<User>;

		beforeAll(async () => {
			db = await getDatabase(options);

			await db.ddl.dropTable({
				tables: 'update_test',
				ifExists: true,
			});

			await db.ddl.createTable({
				name: 'update_test',
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
			users = db.getQueryRepository<User>({ table: 'update_test' });
			await users.insert({
				records: [{ fname: 'test' }],
			});
		});

		it('can update rows', async () => {
			await users.update({
				set: { fname: 'test-updated' },
				where: { myid: 1 },
			});

			const user = await users.findOneOrFail({ where: { myid: 1 } });

			expect(user.fname).toEqual('test-updated');
		});
	});
