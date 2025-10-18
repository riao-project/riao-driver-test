import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { TestDependencies } from '../../../dependency-injection';

export const floatTest = (di: TestDependencies) =>
	describe('Data Types - Float', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
		});

		it('supports float column', async () => {
			const table = 'columns_decimals_float';
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
	});
