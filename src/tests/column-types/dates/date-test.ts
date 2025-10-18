import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { TestDependencies } from '../../../dependency-injection';

export const dateTest = (di: TestDependencies) =>
	describe('Data Types - Date', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
		});

		it('supports date column', async () => {
			const table = 'columns_dates_date';
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

			await db.buildSchema();

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
	});
