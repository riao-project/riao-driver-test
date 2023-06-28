import 'jasmine';
import { ColumnType, Database, gt } from '@riao/dbal';
import { expectDate } from '../../expectations';
import { TestDependencies } from '../../dependency-injection';

export const currentTimestampTest = (di: TestDependencies) =>
	describe('Current Timestamp', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
		});

		it('can select current timestamp', async () => {
			const date = new Date();
			const results = await db.query.find({
				columns: [
					{
						query: db.functions.currentTimestamp(),
						as: 'timestamp',
					},
				],
			});

			expectDate({
				result: results[0].timestamp,
				expected: date,
				toleranceSeconds: 5,
			});
		});

		it('can use current timestamp as default value', async () => {
			await db.ddl.createTable({
				name: 'default_val_current_timestamp',
				columns: [
					{
						name: 'id',
						type: ColumnType.SMALLINT,
						primaryKey: true,
					},
					{
						name: 'timestamp',
						type: ColumnType.TIMESTAMP,
						default: db.functions.currentTimestamp(),
					},
				],
			});

			const date = new Date();

			await db.query.insert({
				table: 'default_val_current_timestamp',
				records: [{ id: 1 }],
			});

			const results = await db.query.find({
				table: 'default_val_current_timestamp',
			});

			expectDate({
				result: results[0].timestamp,
				expected: date,
				toleranceSeconds: 5,
			});
		});

		it('can where current timestamp', async () => {
			await db.ddl.createTable({
				name: 'where_current_timestamp',
				columns: [
					{
						name: 'id',
						type: ColumnType.SMALLINT,
						primaryKey: true,
						autoIncrement: true,
					},
					{
						name: 'timestamp',
						type: ColumnType.TIMESTAMP,
					},
				],
			});

			const date = new Date('2028-02-02 05:25:30Z');

			await db.query.insert({
				table: 'where_current_timestamp',
				records: [
					{ timestamp: new Date('2022-02-02 05:25:30') },
					{ timestamp: date },
				],
			});

			const results = await db.query.find({
				table: 'where_current_timestamp',
				where: {
					timestamp: gt(db.functions.currentTimestamp()),
				},
			});

			expect(results.length).toEqual(1);
			expectDate({
				result: results[0].timestamp,
				expected: date,
				toleranceSeconds: 0,
			});
		});

		it('can insert current timestamp', async () => {
			await db.ddl.createTable({
				name: 'insert_current_timestamp',
				columns: [
					{
						name: 'id',
						type: ColumnType.SMALLINT,
						primaryKey: true,
						autoIncrement: true,
					},
					{
						name: 'timestamp',
						type: ColumnType.TIMESTAMP,
					},
				],
			});

			await db.query.insert({
				table: 'insert_current_timestamp',
				records: [{ timestamp: db.functions.currentTimestamp() }],
			});

			const date = new Date();

			const results = await db.query.find({
				table: 'insert_current_timestamp',
			});

			expect(results.length).toEqual(1);
			expectDate({
				result: results[0].timestamp,
				expected: date,
				toleranceSeconds: 5,
			});
		});
	});
