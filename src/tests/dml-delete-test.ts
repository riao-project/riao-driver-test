import 'jasmine';
import { ColumnType, Database, QueryRepository } from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';

interface User {
	myid: number;
	fname: string;
}

export const dmlDeleteTest = (di: TestDependencies) =>
	describe('Delete', () => {
		let db: Database;
		let users: QueryRepository<User>;

		beforeAll(async () => {
			db = di.db();

			await db.ddl.createTable({
				name: 'delete_test',
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
			users = db.getQueryRepository<User>({ table: 'delete_test' });
			await users.insert({
				records: [{ fname: 'test' }],
			});
		});

		it('can delete rows', async () => {
			await users.delete({ where: { myid: 1 } });
			const user = await users.findOne({ where: { myid: 1 } });

			expect(user).toBeNull();
		});
	});
