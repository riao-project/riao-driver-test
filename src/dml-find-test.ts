import 'jasmine';
import {
	columnName,
	equals,
	gt,
	gte,
	inArray,
	like,
	lt,
	lte,
	not,
	QueryRepository,
} from 'riao-dbal/src';
import { TestOptions } from './test-options';
import { createQueryTestData, User } from './dml-data';

export const dmlFindTest = (options: TestOptions) =>
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

		it('can find with select columns', async () => {
			const results = await users.find({
				columns: ['email'],
				where: { myid: 1 },
			});

			expect(results.length).toBeGreaterThanOrEqual(1);
			expect(results[0].myid).toEqual(undefined);
			expect(results[0].fname).toEqual(undefined);
			expect(results[0].email).toEqual('bob@myusers.com');
		});

		it('can find with limit', async () => {
			const results = await users.find({
				limit: 1,
			});

			expect(results.length).toEqual(1);
			expect(+results[0].myid).toEqual(1);
			expect(results[0].fname).toEqual('Bob');
			expect(results[0].email).toEqual('bob@myusers.com');
		});

		it('can find with order by', async () => {
			const results = await users.find({
				orderBy: { fname: 'DESC' },
			});

			expect(+results[0].myid).toEqual(2);
			expect(results[0].fname).toEqual('Tom');
			expect(results[0].email).toEqual('tom@myusers.com');
		});

		it('can find where (AND)', async () => {
			const results = await users.find({
				where: {
					fname: 'Bob',
					email: 'bob@myusers.com',
				},
			});

			expect(results.length).toBe(1);
			expect(+results[0].myid).toEqual(1);
		});

		it('can find where (OR)', async () => {
			const results = await users.find({
				where: [{ fname: 'Bob' }, 'or', { fname: 'Tom' }],
			});

			expect(results.length).toBe(2);
			expect(+results[0].myid).toEqual(1);
			expect(+results[1].myid).toEqual(2);
		});

		it('can find where (nested)', async () => {
			const results = await users.find({
				where: [
					{ fname: 'Bob' },
					'or',
					[{ fname: 'Tom' }, 'and', { email: 'tom@myusers.com' }],
				],
			});

			expect(results.length).toBe(2);
			expect(+results[0].myid).toEqual(1);
			expect(+results[1].myid).toEqual(2);
		});

		it('can find where - equals', async () => {
			const results = await users.find({
				where: {
					fname: equals('Bob'),
				},
			});

			expect(results.length).toBe(1);
			expect(+results[0].myid).toEqual(1);
		});

		it('can find where - like', async () => {
			const results = await users.find({
				where: {
					email: like('tom@%'),
				},
			});

			expect(results.length).toBe(1);
			expect(+results[0].myid).toEqual(2);
		});

		it('can find where - less than', async () => {
			const results = await users.find({
				where: { myid: lt(2) },
			});

			expect(results.length).toBe(1);
			expect(+results[0].myid).toEqual(1);
		});

		it('can find where - less than or equal to', async () => {
			const results = await users.find({
				where: { myid: lte(2) },
			});

			expect(results.length).toBe(2);
			expect(+results[0].myid).toEqual(1);
			expect(+results[1].myid).toEqual(2);
		});

		it('can find where - greater than', async () => {
			const results = await users.find({
				where: { myid: gt(1) },
			});

			expect(results.length).toBe(1);
			expect(+results[0].myid).toEqual(2);
		});

		it('can find where - greater than or equal to', async () => {
			const results = await users.find({
				where: { myid: gte(1) },
			});

			expect(results.length).toBe(2);
			expect(+results[0].myid).toEqual(1);
			expect(+results[1].myid).toEqual(2);
		});

		it('can find where - in array', async () => {
			const results = await users.find({
				where: { fname: inArray(['Bob', 'Tom']) },
			});

			expect(results.length).toBe(2);
			expect(+results[0].myid).toEqual(1);
			expect(+results[1].myid).toEqual(2);
		});

		it('can find where - not', async () => {
			const results = await users.find({
				where: { fname: not('Tom') },
			});

			expect(results.length).toBe(1);
			expect(+results[0].myid).toEqual(1);
		});

		it('can find where - not like', async () => {
			const results = await users.find({
				where: { email: not(like('tom@%')) },
			});

			expect(results.length).toBe(1);
			expect(+results[0].myid).toEqual(1);
		});

		it('can find where - not in array', async () => {
			const results = await users.find({
				where: { fname: not(inArray(['Tom', 'Sally'])) },
			});

			expect(results.length).toBe(1);
			expect(+results[0].myid).toEqual(1);
		});

		it('can find where - column', async () => {
			const results = await users.find({
				where: { fname: columnName('email') },
			});

			expect(results.length).toBe(0);
		});
	});
