import 'jasmine';
import { ColumnType, Database, DatabaseFunctions } from '@riao/dbal';
import { TestDependencies } from '../../../dependency-injection';
import { expectDate } from '../../../expectations';

export const timestampTest = (di: TestDependencies) =>
	describe('Data Types - Timestamp', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
		});

		it('supports timestamp column', async () => {
			const table = getTableName('');
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

			await db.buildSchema();

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
			const table = getTableName('2038');

			await db.ddl.createTable({
				name: table,
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

			const date = new Date('2048-02-02 05:25:30Z');

			await db.query.insert({
				table,
				records: [{ timestamp: date }],
			});

			const results = await db.query.find({ table });

			expect(results.length).toEqual(1);
			expectDate({
				result: results[0].timestamp,
				expected: date,
				toleranceSeconds: 0,
			});
		});

		it('supports not-null w/ default timestamp', async () => {
			const table = getTableName('not_null_default_timestamp');

			await db.ddl.createTable({
				name: table,
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
						default: DatabaseFunctions.currentTimestamp(),
						required: true,
					},
					{
						name: 'name',
						type: ColumnType.TEXT,
						required: true,
					},
				],
			});

			await db.buildSchema();

			const date = new Date();

			await db.query.insert({
				table,
				records: [{ name: 'Test' }],
			});

			const results = await db.query.find({ table });

			expect(results.length).toEqual(1);
			expectDate({
				result: results[0].timestamp,
				expected: date,
				toleranceSeconds: 10,
			});
		});

		it('can store & retrieve in the right timezone', async () => {
			const table = getTableName('timezone');

			await db.ddl.createTable({
				name: table,
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

			const date = new Date('2028-02-02 05:25:30 EST');

			await db.query.insert({
				table,
				records: [{ timestamp: date }],
			});

			const results = await db.query.find({ table });

			expect(results.length).toEqual(1);
			expectDate({
				result: results[0].timestamp,
				expected: date,
				toleranceSeconds: 0,
			});
		});

		function getTableName(name: string) {
			return `columns_dates_timestamp_${name}`;
		}
	});
