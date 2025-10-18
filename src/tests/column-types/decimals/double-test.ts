import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { TestDependencies } from '../../../dependency-injection';

export const doubleTest = (di: TestDependencies) =>
	describe('Data Types - Double', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
		});

		it('supports double column', async () => {
			const table = 'columns_decimals_double';
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
