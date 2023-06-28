import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { TestDependencies } from '../../dependency-injection';
import { expectDate } from '../../expectations';

export const dateTimeTest = (di: TestDependencies) =>
	describe('Data Types - Date & Time', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
		});

		it('supports date column', async () => {
			const table = 'date_column_test';
			const max = '2999-12-12';

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.DATE,
						name: 'expiration_date',
					},
				],
			});

			await db.query.insert({
				table,
				records: { expiration_date: max },
			});

			const records = await db.query.find({
				table,
				where: {
					expiration_date: max,
				},
			});

			expect(records.length).toEqual(1);
			expect(records[0].expiration_date).toEqual(new Date(max));
		});

		it('supports time column', async () => {
			const table = 'time_column_test';
			const max = '12:59:59';

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.TIME,
						name: 'expiration_time',
					},
				],
			});

			await db.query.insert({
				table,
				records: { expiration_time: max },
			});

			const records = await db.query.find({
				table,
				where: {
					expiration_time: max,
				},
			});

			expect(records.length).toEqual(1);

			let returned = records[0].expiration_time;

			// NOTE: Microsoft SQL returns a date object instead of a time
			//	string.
			if (returned instanceof Date) {
				returned = returned
					.toUTCString()
					.replace(
						/[A-Za-z\,0-9 ]+([0-9]{2}\:[0-9]{2}\:[0-9]{2}) [A-Z]+/,
						'$1'
					);
			}

			expect(returned).toEqual(max);
		});

		it('supports timestamp column', async () => {
			const table = 'timestamp_column_test';
			const max = new Date('2999-12-30T12:12:59.0000Z');

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.TIMESTAMP,
						name: 'expiration',
					},
				],
			});

			await db.query.insert({
				table,
				records: { expiration: max },
			});

			const records = await db.query.find({
				table,
				where: {
					expiration: max,
				},
			});

			expect(records.length).toEqual(1);
			expect(records[0].expiration).toEqual(max);
		});

		it('can store dates past 2038', async () => {
			await db.ddl.createTable({
				name: 'timestamp_2038',
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

			const date = new Date('2048-02-02 05:25:30Z');

			await db.query.insert({
				table: 'timestamp_2038',
				records: [{ timestamp: date }],
			});

			const results = await db.query.find({
				table: 'timestamp_2038',
			});

			expect(results.length).toEqual(1);
			expectDate({
				result: results[0].timestamp,
				expected: date,
				toleranceSeconds: 0,
			});
		});

		it('can store & retrieve in the right timezone', async () => {
			await db.ddl.createTable({
				name: 'timestamp_timezone',
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

			const date = new Date('2028-02-02 05:25:30 EST');

			await db.query.insert({
				table: 'timestamp_timezone',
				records: [{ timestamp: date }],
			});

			const results = await db.query.find({
				table: 'timestamp_timezone',
			});

			expect(results.length).toEqual(1);
			expectDate({
				result: results[0].timestamp,
				expected: date,
				toleranceSeconds: 0,
			});
		});
	});
