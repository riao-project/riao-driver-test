import 'jasmine';
import { QueryRepository, like } from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';
import { User } from '../dml-data';

export const dmlFindOneTest = (di: TestDependencies) =>
	describe('Query findOne()', () => {
		let users: QueryRepository<User>;

		beforeAll(async () => {
			users = di.repo();
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
