import 'jasmine';
import { ColumnType, Database, QueryRepository } from 'riao-dbal/src';
import { TestDependencies } from '../dependency-injection';

interface User {
	myid: number;
	fname: string;
}

export const dmlUpdateTest = (di: TestDependencies) =>
	describe('Update', () => {
		let db: Database;
		let users: QueryRepository<User>;

		beforeAll(async () => {
			db = di.db();

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
