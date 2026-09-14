import 'jasmine';
import { QueryRepository } from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';
import { User } from '../dml-data';

export const dmlCountTest = (di: TestDependencies) =>
	describe('Query count()', () => {
		let users: QueryRepository<User>;

		beforeAll(async () => {
			users = di.repo();
		});

		it('can count', async () => {
			const count = await users.count({});

			expect(typeof count).toEqual('number');
			expect(count).toBe(3);
		});

		it('can count with groupBy - returns number of groups', async () => {
			// Test data has: Bob, Tom, Bob (3 total records, 2 distinct fname values)
			// When groupBy is used, count should return the number of groups
			const count = await users.count({
				groupBy: ['fname'],
			});

			expect(typeof count).toEqual('number');
			expect(count).toBe(2);
		});

		it('can count with groupBy and where clause', async () => {
			// Count groups of fname where fname = 'Bob'
			// Should return 1 (only one 'Bob' group)
			const count = await users.count({
				where: { fname: 'Bob' },
				groupBy: ['fname'],
			});

			expect(typeof count).toEqual('number');
			expect(count).toBe(1);
		});

		it('can count distinct column', async () => {
			// Count distinct email values
			// Should be 3 (all three records have unique emails)
			const count = await users.count(
				{},
				{
					distinct: true,
					column: 'email',
				}
			);

			expect(typeof count).toEqual('number');
			expect(count).toBe(3);
		});
	});
