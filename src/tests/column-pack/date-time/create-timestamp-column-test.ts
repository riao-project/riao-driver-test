import 'jasmine';
import { ColumnType, Database } from '@riao/dbal';
import { CreateTimestampColumn } from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';
import { expectDate } from '../../../expectations';

export const createTimestampColumnTest = (di: TestDependencies) =>
	describe('Column Pack - CreateTimestampColumn', () => {
		let db: Database;
		const table = 'create_timestamp_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create a create_timestamp column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [
					CreateTimestampColumn,
					{ name: 'number', type: ColumnType.INT, primaryKey: true },
				],
			});

			const repo = db.getQueryRepository({ table });

			await repo.insertOne({
				record: { number: 1 },
				ignoreReturnId: true,
			});

			const { create_timestamp } = await repo.findOne({
				where: { number: 1 },
			});

			expectDate({
				expected: new Date(),
				result: create_timestamp,
				toleranceSeconds: 5,
			});
		});
	});
