import 'jasmine';
import { QueryRepository, like } from 'riao-dbal/src';
import { TestOptions } from './test-options';
import { createQueryTestData, User } from './dml-data';

export const dmlFindOneTest = (options: TestOptions) =>
	describe(options.name + ' Query findOne()', () => {
		let users: QueryRepository<User>;

		beforeAll(async () => {
			users = await createQueryTestData(options);
		});

		it('can find one', async () => {
			const user = await users.findOneOrFail({ where: { myid: 1 } });

			expect(user.fname).toEqual('Bob');
			expect(user.email).toEqual('bob@myusers.com');
		});

		it('returns the first row if multipe matches are found', async () => {
			const user = await users.findOneOrFail({
				where: { fname: like('%') },
			});

			expect(user.fname).toEqual('Bob');
			expect(user.email).toEqual('bob@myusers.com');
		});

		it('throws an error if no matches are found', async () => {
			// TODO: Return better error classes
			await expectAsync(
				users.findOneOrFail({
					where: { fname: like('Drew') },
				})
			).toBeRejectedWithError('Result not found!');
		});
	});
