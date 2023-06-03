import 'jasmine';
import { QueryRepository } from 'riao-dbal/src';
import { TestOptions } from './test-options';
import { createQueryTestData, User } from './dml-data';

export const dmlFind = (options: TestOptions) =>
	describe(options.name + ' Query find()', () => {
		let users: QueryRepository<User>;

		beforeAll(async () => {
			users = await createQueryTestData(options);
		});

		it('can find', async () => {
			const results = await users.find({ where: { myid: 1 } });

			expect(results.length).toEqual(1);
			expect(+results[0].myid).toEqual(1);
			expect(results[0].fname).toEqual('Bob');
			expect(results[0].email).toEqual('bob@myusers.com');
		});
	});
