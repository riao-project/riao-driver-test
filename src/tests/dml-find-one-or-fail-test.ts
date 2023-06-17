import 'jasmine';
import { QueryRepository, like } from 'riao-dbal/src';
import { TestDependencies } from '../dependency-injection';
import { User } from '../dml-data';

export const dmlFindOneOrFailTest = (di: TestDependencies) =>
	describe('Query findOneOrFail()', () => {
		let users: QueryRepository<User>;

		beforeAll(async () => {
			users = di.repo();
		});

		it('can find one', async () => {
			const user = await users.findOne({ where: { myid: 1 } });

			expect(user.fname).toEqual('Bob');
			expect(user.email).toEqual('bob@myusers.com');
		});

		it('returns the first row if multipe matches are found', async () => {
			const user = await users.findOne({
				where: { fname: like('%') },
			});

			expect(user.fname).toEqual('Bob');
			expect(user.email).toEqual('bob@myusers.com');
		});

		it('returns null if no matches are found', async () => {
			const user = await users.findOne({
				where: { fname: like('Drew') },
			});

			expect(user).toBeNull();
		});
	});
