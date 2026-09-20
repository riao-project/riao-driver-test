import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { TestDependencies } from '../../../dependency-injection';

export const jsonTest = (di: TestDependencies) =>
	describe('Data Types - JSON', () => {
		let db: Database;
		const table = 'columns_json_json';

		beforeAll(() => {
			db = di.db();
		});

		it('supports json column values', async () => {
			const payload = {
				nested: { ok: true },
				count: 2,
				tags: ['a', 'b'],
			};

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: ColumnType.JSON,
						name: 'json_val',
					},
					{
						type: ColumnType.VARCHAR,
						length: 255,
						name: 'name',
					},
				],
			});

			await db.query.insert({
				table,
				records: [{ json_val: payload, name: 'json-object' }],
			});

			const records = await db.query.find({
				table,
				where: { name: 'json-object' },
			});

			expect(records.length).toEqual(1);
			expect(records[0].json_val).toEqual(payload);
		});
	});
