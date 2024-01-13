import 'jasmine';
import {
	ColumnType,
	Database,
	DatabaseFunctions,
	QueryRepository,
} from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';

interface User {
	myid: number;
	fname: string;
}

export const dmlInsertTest = (di: TestDependencies) =>
	describe('Insert', () => {
		let db: Database;
		let users: QueryRepository<User>;

		beforeAll(async () => {
			db = di.db();

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
			const result = await users.insertOne({
				record: {
					fname: 'Test',
				},
				primaryKey: 'myid',
			});

			expect(+result.myid).toBeGreaterThanOrEqual(1);

			await users.insert({
				records: [
					{
						fname: 'Bob',
					},
					{
						fname: 'Tom',
					},
				],
			});
		});

		it('can insert rows from function', async () => {
			const control = new Date();
			const record = await users.insertOne({
				record: {
					fname: <any>DatabaseFunctions.currentTimestamp(),
				},
				primaryKey: 'myid',
			});

			const found = await users.findOne({
				where: { myid: +record.myid },
			});

			expect(found.fname.length).toBeGreaterThanOrEqual(1);
		});
	});
