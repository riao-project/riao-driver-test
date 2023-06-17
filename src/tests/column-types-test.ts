import 'jasmine';
import { ColumnOptions, ColumnType, Database, like } from 'riao-dbal/src';
import { TestDependencies } from '../dependency-injection';

export const columnTypesTest = (di: TestDependencies) =>
	describe('Data Types', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
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
			const max = 1234567890123.99;

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.DECIMAL,
						name: 'n_numbers',
						significant: 13,
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

		const textTest = async (
			columnType: ColumnType,
			options: Partial<ColumnOptions>,
			strlen: number
		) => {
			const table = columnType.toLowerCase() + '_column_test';

			const startCode = 32;
			const codeRange = 64;
			let str = '';

			for (let i = 0; i < strlen; i++) {
				str += String.fromCharCode(
					Math.round(Math.random() * codeRange) + startCode
				);
			}

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: <any>columnType,
						name: 'text_val',
						...options,
					},
				],
			});

			await db.query.insert({
				table,
				records: { text_val: str },
			});

			let where = {};

			if (columnType === ColumnType.TEXT) {
				where = { text_val: like('%') };
			}
			else {
				where = { text_val: str };
			}

			const records = await db.query.find({
				table,
				where,
			});

			expect(records.length).toEqual(1);
			expect(records[0].text_val).toEqual(str);
		};

		it('supports char column', async () => {
			await textTest(ColumnType.CHAR, {}, 1);
		});

		it('supports varchar column', async () => {
			const length = 8000;
			await textTest(ColumnType.VARCHAR, { length }, length);
		});

		it('supports text column', async () => {
			await textTest(ColumnType.TEXT, {}, 65535);
		});

		it('supports blob column', async () => {
			const table = 'blob_column_test';

			const strlen = 255;
			const startCode = 0;
			const codeRange = 65535;
			let str = '';

			for (let i = 0; i < strlen; i++) {
				str += String.fromCharCode(
					Math.round(Math.random() * codeRange) + startCode
				);
			}

			const buf = Buffer.from(str);

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.BLOB,
						name: 'bin_val',
					},
				],
			});

			await db.query.insert({
				table,
				records: { bin_val: buf },
			});

			const records = await db.query.find({ table });

			const returnedBuffer = Buffer.from(records[0].bin_val);

			expect(records.length).toEqual(1);
			expect(returnedBuffer).toEqual(buf);
		});
	});
