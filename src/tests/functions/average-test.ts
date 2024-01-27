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

export const averageTest = (di: TestDependencies) =>
	describe('Average()', () => {
		let db: Database;
		let users: QueryRepository<User>;

		beforeAll(() => {
			db = di.db();
			users = di.repo();
		});

		it('can select average column', async () => {
			const results: any = await users.findOne({
				columns: [
					{
						query: DatabaseFunctions.average(columnName('myid')),
						as: 'average',
					},
				],
			});

			expect(+results.average).toEqual(2);
		});
	});
