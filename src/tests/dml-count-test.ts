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

			expect(+count).toBe(3);
		});
	});
