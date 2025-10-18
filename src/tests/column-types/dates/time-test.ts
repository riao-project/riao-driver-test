import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { TestDependencies } from '../../../dependency-injection';

export const timeTest = (di: TestDependencies) =>
	describe('Data Types - Time', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
		});

		it('supports time column', async () => {
			const table = 'columns_dates_time';
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
	});
