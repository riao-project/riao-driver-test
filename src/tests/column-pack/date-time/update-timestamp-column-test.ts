import 'jasmine';
import { Database } from '@riao/dbal';
import {
	CreateTimestampColumn,
	IntKeyColumn,
	NameColumn,
	UpdateTimestampColumn,
} from '@riao/dbal/column-pack';
import { TestDependencies } from '../../../dependency-injection';

export const updateTimestampColumnTest = (di: TestDependencies) =>
	describe('Column Pack - UpdateTimestampColumnTest', () => {
		let db: Database;
		const table = 'update_timestamp_column_test';

		beforeAll(() => {
			db = di.db();
		});

		it('can create an update_timestamp column', async () => {
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [
					IntKeyColumn,
					NameColumn,
					CreateTimestampColumn,
					UpdateTimestampColumn,
				],
			});

			const repo = db.getQueryRepository({ table, identifiedBy: 'id' });

			await repo.insertOne({
				record: { name: 'test1' },
			});

			await new Promise((a) => setTimeout(a, 1000));

			await repo.update({
				set: { name: 'test2' },
				where: { id: 1 },
			});

			const record = await repo.findById(1);

			const createdAt = new Date(record.create_timestamp).getTime();
			const updatedAt = new Date(record.update_timestamp).getTime();
			const diffSec = (updatedAt - createdAt) / 1000;

			expect(record.name).toBe('test2');
			expect(diffSec).toBeGreaterThanOrEqual(1);
			expect(diffSec).toBeLessThanOrEqual(2);
		});
	});
