import 'jasmine';
import {
	columnName,
	DatabaseRecord,
	equals,
	gt,
	gte,
	inArray,
	like,
	lt,
	lte,
	not,
	QueryRepository,
} from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';
import { User } from '../dml-data';

export const dmlFindTest = (di: TestDependencies) =>
	describe('Query find()', () => {
		let users: QueryRepository<User>;

		beforeAll(() => {
			users = di.repo();
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

		it('can find with select distinct', async () => {
			const results = await users.find({
				columns: ['fname'],
				distinct: true,
			});

			expect(results.length).toEqual(2);
			expect(results[0].fname).toEqual('Bob');
			expect(results[1].fname).toEqual('Tom');
		});

		it('can find with select columns as', async () => {
			const results = <DatabaseRecord[]>await users.find({
				columns: [
					{
						column: 'myid',
						as: 'user_id',
					},
					{
						column: 'fname',
						as: 'user_fname',
					},
					'email',
				],
				where: { myid: 1 },
			});

			expect(results.length).toBeGreaterThanOrEqual(1);
			expect(+results[0].user_id).toEqual(1);
			expect(results[0].user_fname).toEqual('Bob');
			expect(results[0].email).toEqual('bob@myusers.com');
		});

		it('can find with select with subquery', async () => {
			const results = <DatabaseRecord[]>await users.find({
				columns: [
					{
						query: {
							table: 'query_test',
							columns: ['myid'],
							where: { myid: 1 },
						},
						as: 'first_id',
					},
					{
						query: {
							table: 'query_test',
							columns: ['fname'],
							where: { myid: 2 },
						},
						as: 'second_name',
					},
				],
				where: { myid: 1 },
			});

			expect(results.length).toBeGreaterThanOrEqual(1);
			expect(+results[0].first_id).toEqual(1);
			expect(results[0].second_name).toEqual('Tom');
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

			expect(results.length).toBe(3);
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

			expect(results.length).toBe(3);
			expect(+results[0].myid).toEqual(1);
			expect(+results[1].myid).toEqual(2);
		});

		it('can find where - equals', async () => {
			const results = await users.find({
				where: {
					fname: equals('Bob'),
				},
			});

			expect(results.length).toBe(2);
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

			expect(results.length).toBe(2);
			expect(+results[0].myid).toEqual(2);
		});

		it('can find where - greater than or equal to', async () => {
			const results = await users.find({
				where: { myid: gte(1) },
			});

			expect(results.length).toBe(3);
			expect(+results[0].myid).toEqual(1);
			expect(+results[1].myid).toEqual(2);
		});

		it('can find where - in array', async () => {
			const results = await users.find({
				where: { fname: inArray(['Bob', 'Tom']) },
			});

			expect(results.length).toBe(3);
			expect(+results[0].myid).toEqual(1);
			expect(+results[1].myid).toEqual(2);
		});

		it('can find where - not', async () => {
			const results = await users.find({
				where: { fname: not('Tom') },
			});

			expect(results.length).toBe(2);
			expect(+results[0].myid).toEqual(1);
		});

		it('can find where - not null', async () => {
			const results = await users.find({
				where: { fname: not(null) },
			});

			expect(results.length).toBe(3);
			expect(+results[0].myid).toEqual(1);
		});

		it('can find where - not like', async () => {
			const results = await users.find({
				where: { email: not(like('tom@%')) },
			});

			expect(results.length).toBe(2);
			expect(+results[0].myid).toEqual(1);
		});

		it('can find where - not in array', async () => {
			const results = await users.find({
				where: { fname: not(inArray(['Tom', 'Sally'])) },
			});

			expect(results.length).toBe(2);
			expect(+results[0].myid).toEqual(1);
		});

		it('can find where - column', async () => {
			const results = await users.find({
				where: { fname: columnName('email') },
			});

			expect(results.length).toBe(0);
		});

		it('can find with compound query', async () => {
			const results = await users.find({
				columns: ['myid'],
				where: {
					myid: gte(2),
				},
				orderBy: {
					myid: 'DESC',
				},
				limit: 1,
			});

			expect(results?.length).toEqual(1);
			expect(+results[0].myid).toEqual(3);
		});
	});
