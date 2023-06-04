import 'jasmine';
import { ColumnType, Database } from 'riao-dbal/src';
import { TestOptions } from './test-options';
import { getDatabase } from './init';

export const columnTypesTest = (options: TestOptions) =>
	describe(options.name + ' Data Types', () => {
		let db: Database;

		beforeAll(async () => {
			db = await getDatabase(options);

			await db.ddl.dropTable({
				tables: [
					'bool_column_test',
					'tinyint_column_test',
					'smallint_column_test',
					'int_column_test',
					'bigint_column_test',
					'decimal_column_test',
					'float_column_test',
					'double_column_test',
					'date_column_test',
					'time_column_test',
					'datetime_column_test',
				],
				ifExists: true,
			});
		});

		it('supports bool column', async () => {
			await db.ddl.createTable({
				name: 'bool_column_test',
				columns: [
					{
						type: ColumnType.BOOL,
						name: 'is_a_bool',
					},
				],
			});

			await db.query.insert({
				table: 'bool_column_test',
				records: [{ is_a_bool: true }, { is_a_bool: false }],
			});

			const truthyRecords = await db.query.find({
				table: 'bool_column_test',
				where: {
					is_a_bool: true,
				},
			});

			expect(truthyRecords.length).toEqual(1);
			expect(truthyRecords[0].is_a_bool).toBeTruthy();

			const falsyRecords = await db.query.find({
				table: 'bool_column_test',
				where: {
					is_a_bool: false,
				},
			});

			expect(falsyRecords.length).toEqual(1);
			expect(falsyRecords[0].is_a_bool).toBeFalsy();
		});

		const integerTest = async (
			columnType: ColumnType,
			max: number | bigint
		) => {
			const table = columnType.toLowerCase() + '_column_test';

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: <any>columnType,
						name: 'n_numbers',
					},
				],
			});

			await db.query.insert({
				table,
				records: [{ n_numbers: max }],
			});

			const records = await db.query.find({
				table,
				where: {
					n_numbers: max,
				},
			});

			if (columnType === ColumnType.BIGINT) {
				records[0].n_numbers = BigInt(records[0].n_numbers);
			}

			expect(records.length).toEqual(1);
			expect(records[0].n_numbers).toEqual(max);
		};

		it('supports tinyint column', async () => {
			await integerTest(ColumnType.TINYINT, 127);
		});

		it('supports small int column', async () => {
			await integerTest(ColumnType.SMALLINT, 32767);
		});

		it('supports int column', async () => {
			await integerTest(ColumnType.INT, 2147483647);
		});

		it('supports big-int column', async () => {
			await integerTest(ColumnType.BIGINT, BigInt('9223372036854775807'));
		});

		it('supports decimal column', async () => {
			const table = 'decimal_column_test';
			const max = 12345678901.99;

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.DECIMAL,
						name: 'n_numbers',
						significant: 11,
						decimal: 2,
					},
				],
			});

			await db.query.insert({
				table,
				records: { n_numbers: max },
			});

			const records = await db.query.find({
				table,
				where: {
					n_numbers: max,
				},
			});

			expect(records.length).toEqual(1);
			expect(+records[0].n_numbers).toEqual(max);
		});

		it('supports float column', async () => {
			const table = 'float_column_test';
			const max = 1.234567;

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.FLOAT,
						name: 'n_numbers',
					},
				],
			});

			await db.query.insert({
				table,
				records: { n_numbers: max },
			});

			const records = await db.query.find({
				table,
			});

			expect(records.length).toEqual(1);
			expect(records[0].n_numbers).toBeCloseTo(max);
		});

		it('supports double column', async () => {
			const table = 'double_column_test';
			const max = '1.2345675678912345';

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.DOUBLE,
						name: 'n_numbers',
					},
				],
			});

			await db.query.insert({
				table,
				records: { n_numbers: max },
			});

			const records = await db.query.find({
				table,
			});

			expect(records.length).toEqual(1);
			expect(records[0].n_numbers).toBeCloseTo(+max);
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

		it('supports datetime column', async () => {
			const table = 'datetime_column_test';
			const max = new Date('2999-12-30T12:12:59.0000Z');

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.DATETIME,
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
	});
