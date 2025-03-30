import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { BigIntKeyColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const bigIntKeyColumnTest = (di: TestDependencies) =>
	describe('Column Pack - BigIntKeyColumn', () => {
		let db: Database;
		const table = 'big_int_key_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a big int key column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [
					BigIntKeyColumn,
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
			expect(BigInt(result.id)).toEqual(BigInt(1));
		});
	});
