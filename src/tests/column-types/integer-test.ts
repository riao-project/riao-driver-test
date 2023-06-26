import 'jasmine';
import { ColumnType, Database } from 'riao-dbal/src';
import { TestDependencies } from '../../dependency-injection';

export const integerTest = (di: TestDependencies) =>
	describe('Data Types - Integer', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
		});

		const integerTest = async (
			columnType: ColumnType,
			max: number | bigint
		) => {
			const table = columnType.toLowerCase() + '_column_test';

			let zeroValue: number | bigint = 0;
			let maxValue: number | bigint = max;
			let minValue: number | bigint = -max;

			if (columnType === ColumnType.BIGINT) {
				zeroValue = BigInt(zeroValue);
				maxValue = BigInt(maxValue);
				minValue = BigInt('-' + max);
			}

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: <any>columnType,
						name: 'n_numbers',
					},
					{
						type: <any>columnType,
						name: 'n_default_zero',
						default: 0,
					},
					{
						type: <any>columnType,
						name: 'n_default_min',
						default: minValue,
					},
					{
						type: <any>columnType,
						name: 'n_default_max',
						default: maxValue,
					},
					{
						type: <any>columnType,
						name: 'n_default_auto_increment',
						autoIncrement: true,
						primaryKey: true,
					},
					{
						type: <any>columnType,
						name: 'n_default_null',
					},
				],
			});

			await db.query.insert({
				table,
				records: [
					{ n_numbers: zeroValue },
					{ n_numbers: maxValue },
					{ n_numbers: minValue },
				],
			});

			const zeroRecords = await db.query.find({
				table,
				where: { n_numbers: zeroValue },
			});

			const maxRecords = await db.query.find({
				table,
				where: { n_numbers: maxValue },
			});

			const minRecords = await db.query.find({
				table,
				where: { n_numbers: minValue },
			});

			if (columnType === ColumnType.BIGINT) {
				const converter = (val) => (val ? BigInt(val) : val);

				for (const rec of [zeroRecords, maxRecords, minRecords]) {
					rec[0].n_numbers = converter(rec[0].n_numbers);
					rec[0].n_default_min = BigInt(rec[0].n_default_min);
					rec[0].n_default_max = BigInt(rec[0].n_default_max);
				}
			}

			expect(zeroRecords.length).toEqual(1);
			expect(zeroRecords[0].n_numbers).toEqual(0);
			expect(zeroRecords[0].n_default_zero).toEqual(0);
			expect(zeroRecords[0].n_default_min).toEqual(minValue);
			expect(zeroRecords[0].n_default_max).toEqual(maxValue);
			expect(zeroRecords[0].n_default_auto_increment).toEqual(1);
			expect(zeroRecords[0].n_default_null).toBeNull();

			expect(maxRecords.length).toEqual(1);
			expect(maxRecords[0].n_numbers).toEqual(maxValue);
			expect(maxRecords[0].n_default_auto_increment).toEqual(2);

			expect(minRecords.length).toEqual(1);
			expect(minRecords[0].n_numbers).toEqual(minValue);
			expect(minRecords[0].n_default_auto_increment).toEqual(3);
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
	});
