import 'jasmine';
import { Database } from '@riao/dbal';
import { TestDependencies } from '../../../dependency-injection';
import {
	CreateTimestampColumn,
	IntKeyColumn,
	NameColumn,
} from '@riao/dbal/column-pack';
import { UpdateTimestampTrigger } from '@riao/dbal/triggers/prebuilt';

export const updateTimestampTrigger = (di: TestDependencies) =>
	describe('UpdateTimestampTrigger', () => {
		let db: Database;
		const table = 'update_timestamp_trigger';
		let trigger: UpdateTimestampTrigger;

		beforeAll(async () => {
			db = di.db();

			await db.ddl.createTable({
				name: table,
				columns: [
					IntKeyColumn,
					NameColumn,
					{ ...CreateTimestampColumn, name: 'created_at' },
					{ ...CreateTimestampColumn, name: 'updated_at' },
				],
			});
		});

		beforeEach(() => {
			trigger = new UpdateTimestampTrigger({
				table,
				column: 'updated_at',
				idColumn: 'id',
			});
		});

		it('should update the timestamp column', async () => {
			await db.ddl.createTrigger(
				trigger.getTrigger({
					queryBuilder: db.getQueryBuilder(),
				})
			);

			const queryRepo = db.getQueryRepository({
				table,
				identifiedBy: 'id',
			});

			await queryRepo.insert({
				records: [{ name: 'test1' }],
			});

			await new Promise((a) => setTimeout(a, 1000));

			await queryRepo.update({
				set: { name: 'test2' },
				where: { id: 1 },
			});

			const record = await queryRepo.findById(1);

			const createdAt = new Date(record.created_at).getTime();
			const updatedAt = new Date(record.updated_at).getTime();
			const diffSec = (updatedAt - createdAt) / 1000;

			expect(record.name).toBe('test2');
			expect(diffSec).toBeGreaterThanOrEqual(1);
			expect(diffSec).toBeLessThanOrEqual(2);
		});
	});
