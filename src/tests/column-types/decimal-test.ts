import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { TestDependencies } from '../../dependency-injection';

export const decimalTest = (di: TestDependencies) =>
	describe('Data Types - Decimal', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
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
	});
