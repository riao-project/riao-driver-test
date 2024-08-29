import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { IntKeyColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const intKeyColumnTest = (di: TestDependencies) =>
	describe('Column Pack - IntKeyColumn', () => {
		let db: Database;
		const table = 'int_key_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create an int key column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [
					IntKeyColumn,
					{ name: 'number', type: ColumnType.INT },
				],
			});

			const repo = db.getQueryRepository({ table });

			const { id: returnId } = await repo.insertOne({
				record: { number: 1 },
				primaryKey: 'id',
			});

			const result = await repo.findOne({
				where: { id: 1 },
			});

			expect(returnId).toEqual(result.id);
			expect(result.id).toEqual(1);
		});
	});
