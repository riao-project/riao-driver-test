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
			const count: any = await users.count();

			expect(typeof count).toEqual('number');
			expect(count).toBeGreaterThanOrEqual(1);
		});

		it('can count distinct', async () => {
			const { count_distinct, count_full } = <any>await users.findOne({
				columns: [
					{
						query: DatabaseFunctions.count({
							distinct: true,
							column: 'fname',
						}),
						as: 'count_distinct',
					},
					{
						query: DatabaseFunctions.count(),
						as: 'count_full',
					},
				],
			});

			expect(count_distinct).toBeGreaterThanOrEqual(1);
			expect(count_full).toBeGreaterThanOrEqual(1);
			expect(count_full).toBeGreaterThan(count_distinct);
		});
	});
