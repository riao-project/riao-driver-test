import 'jasmine';
import { QueryRepository, like } from 'riao-dbal/src';
import { TestOptions } from '../test-options';
import { createQueryTestData, User } from '../dml-data';

export const dmlFindOneOrFailTest = (options: TestOptions) =>
	describe(options.name + ' Query findOneOrFail()', () => {
		let users: QueryRepository<User>;

		beforeAll(async () => {
			users = await createQueryTestData(options);
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
