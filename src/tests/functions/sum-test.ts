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

export const sumTest = (di: TestDependencies) =>
	describe('Sum()', () => {
		let db: Database;
		let users: QueryRepository<User>;

		beforeAll(() => {
			db = di.db();
			users = di.repo();
		});

		it('can select sum column', async () => {
			const results: any = await users.findOne({
				columns: [
					{
						query: DatabaseFunctions.sum(columnName('myid')),
						as: 'sum',
					},
				],
			});

			expect(+results.sum).toBeGreaterThanOrEqual(5);
		});
	});
