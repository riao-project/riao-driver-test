import 'jasmine';
import { ColumnType, Database, DatabaseFunctions, gt } from '@riao/dbal';
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
						query: DatabaseFunctions.currentTimestamp(),
						as: 'timestamp',
					},
				],
			});

			expect(results.length).toEqual(1);
			let val = results[0].timestamp;

			if (di.options().name.includes('Sqlite')) {
				console.warn(
					'Selecting timestamp queries will not be returned as a Date instance in sqlite.'
				);
				console.warn(
					'Selecting timestamp does not return timezone in sqlite.'
				);
				val = new Date(val + 'Z');
			}

			expectDate({
				result: val,
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
						default: DatabaseFunctions.currentTimestamp(),
					},
				],
			});

			await db.buildSchema();

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

			await db.buildSchema();

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
					timestamp: gt(DatabaseFunctions.currentTimestamp()),
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

			await db.buildSchema();

			await db.query.insert({
				table: 'insert_current_timestamp',
				records: [{ timestamp: DatabaseFunctions.currentTimestamp() }],
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
