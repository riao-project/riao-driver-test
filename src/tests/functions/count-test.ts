import 'jasmine';
import {
	ColumnType,
	Database,
	DatabaseFunctions,
	QueryRepository,
	columnName,
	gt,
} from '@riao/dbal';
import { TestDependencies } from '../../dependency-injection';
import { User } from '../../dml-data';

export const countTest = (di: TestDependencies) =>
	describe('Count', () => {
		let db: Database;
		let users: QueryRepository<User>;

		beforeAll(() => {
			db = di.db();
			users = di.repo();
		});

		it('can count *', async () => {
			const results: any = await users.findOne({
				columns: [
					{
						query: DatabaseFunctions.count(),
						as: 'count',
					},
				],
			});

			expect(results.count).toBeGreaterThanOrEqual(1);
		});
	});
