import 'jasmine';
import {
	and,
	between,
	columnName,
	DatabaseFunctions,
	DatabaseRecord,
	divide,
	equals,
	gt,
	gte,
	inArray,
	like,
	lt,
	lte,
	minus,
	modulo,
	not,
	or,
	plus,
	QueryRepository,
	Subquery,
	times,
} from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';
import { User } from '../dml-data';

export const dmlFindTest = (di: TestDependencies) =>
	describe('Query find()', () => {
		let users: QueryRepository<User>;
		let db: QueryRepository;

		beforeAll(() => {
			users = di.repo();
			db = di.db().getQueryRepository();
		});

		it('can find', async () => {
			const results = await users.find({ where: { myid: 1 } });

			expect(results.length).toEqual(1);
			expect(+results[0].myid).toEqual(1);
			expect(results[0].fname).toEqual('Bob');
			expect(results[0].email).toEqual('bob@myusers.com');
		});

		it('can find with table alias', async () => {
			const results = await di.db().query.find({
				table: 'query_test',
				tableAlias: 'u',
				where: { 'u.myid': 1 },
			});

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

		it('can find with select literal number', async () => {
			const results = <DatabaseRecord[]>await db.find({
				columns: [
					{
						query: 1,
						as: 'one',
					},
				],
			});

			expect(results.length).toBeGreaterThanOrEqual(1);
			expect(+results[0].one).toEqual(1);
		});

		it('can find with select literal string', async () => {
			const results = <DatabaseRecord[]>await db.find({
				columns: [
					{
						query: 'one',
						as: 'first',
					},
				],
			});

			expect(results.length).toBeGreaterThanOrEqual(1);
			expect(results[0].first).toEqual('one');
		});

		it('can find with select function', async () => {
			const results = <DatabaseRecord[]>await users.find({
				columns: [
					{
						query: DatabaseFunctions.count(),
						as: 'count',
					},
				],
			});

			expect(results.length).toBeGreaterThanOrEqual(1);
			expect(+results[0].count).toBeGreaterThanOrEqual(1);
		});

		it('can find with select with subquery', async () => {
			const results = <DatabaseRecord[]>await users.find({
				columns: [
					{
						query: new Subquery({
							table: 'query_test',
							columns: ['myid'],
							where: { myid: 1 },
						}),
						as: 'first_id',
					},
					{
						query: new Subquery({
							table: 'query_test',
							columns: ['fname'],
							where: { myid: 2 },
						}),
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

		it('can find with group by', async () => {
			const results: any = await users.find({
				columns: [
					'fname',
					{ query: DatabaseFunctions.count(), as: 'count' },
				],
				groupBy: ['fname'],
			});

			expect(results.length).toEqual(2);
			expect(results[0].fname).toEqual('Bob');
			expect(+results[0].count).toEqual(2);
			expect(results[1].fname).toEqual('Tom');
			expect(+results[1].count).toEqual(1);
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
				where: [{ fname: 'Bob' }, or, { fname: 'Tom' }],
			});

			expect(results.length).toBe(3);
			expect(+results[0].myid).toEqual(1);
			expect(+results[1].myid).toEqual(2);
		});

		it('can find where (nested)', async () => {
			const results = await users.find({
				where: [
					{ fname: 'Bob' },
					or,
					[{ fname: 'Tom' }, and, { email: 'tom@myusers.com' }],
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

		it('like is case-insensitive', async () => {
			const results = await users.find({
				where: {
					email: like('TOM@%'),
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

		it('can find where - between', async () => {
			const results = await users.find({
				where: { myid: between(2, 4) },
			});

			expect(results.length).toBe(2);
			expect(+results[0].myid).toEqual(2);
			expect(+results[1].myid).toEqual(3);
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

		it('can find with compound query', async () => {
			const results: any = await users.find({
				columns: [
					'fname',
					{ query: DatabaseFunctions.count(), as: 'count' },
				],
				where: {
					myid: gte(2),
				},
				groupBy: ['fname'],
				orderBy: {
					fname: 'DESC',
				},
				limit: 1,
			});

			expect(results?.length).toEqual(1);
			expect(results[0].fname).toEqual('Tom');
			expect(+results[0].count).toEqual(1);
		});

		it('can add', async () => {
			const result = await db.findOne({
				columns: [{ query: [1, plus, 2], as: 'sum' }],
			});

			expect(result.sum).toEqual(3);
		});

		it('can add decimal numbers', async () => {
			const result = await db.findOne({
				columns: [{ query: [1.23, plus, 2], as: 'sum' }],
			});

			expect(+result.sum).toEqual(3.23);
		});

		it('can subtract', async () => {
			const result = await db.findOne({
				columns: [{ query: [1, minus, 2], as: 'diff' }],
			});

			expect(result.diff).toEqual(-1);
		});

		it('can multiply', async () => {
			const result = await db.findOne({
				columns: [{ query: [2, times, 4], as: 'product' }],
			});

			expect(result.product).toEqual(8);
		});

		it('can divide', async () => {
			const result = await db.findOne({
				columns: [{ query: [8, divide, 2], as: 'quotient' }],
			});

			expect(result.quotient).toEqual(4);
		});

		it('can modulo', async () => {
			const result = await db.findOne({
				columns: [{ query: [8, modulo, 3], as: 'remainder' }],
			});

			expect(result.remainder).toEqual(2);
		});

		it('can perform parenthesized equations', async () => {
			const result = await db.findOne({
				columns: [{ query: [2, times, [4.2, minus, 2]], as: 'result' }],
			});

			expect(+result.result).toEqual(4.4);
		});

		it('can perform math on columns', async () => {
			const result = await users.find({
				columns: [
					{ query: [2, times, columnName('myid')], as: 'myid' },
				],
				orderBy: { myid: 'ASC' },
			});

			expect(+result[0].myid).toEqual(2);
			expect(+result[1].myid).toEqual(4);
			expect(+result[2].myid).toEqual(6);
		});

		it('can select math with functions', async () => {
			const result = await db.find({
				columns: [
					{
						query: [DatabaseFunctions.count()],
						as: 'control',
					},
					{
						query: [2, times, DatabaseFunctions.count()],
						as: 'sample',
					},
				],
				table: users.getTableName(),
			});

			expect(+result[0].control).toEqual(3);
			expect(+result[0].sample).toEqual(6);
		});

		it('can where with decimal math', async () => {
			const result = await users.find({
				where: [[columnName('myid'), divide, 2.1], gt(1)],
			});

			expect(result.length).withContext('number of results').toEqual(1);
			expect(+result[0].myid).withContext('first id').toEqual(3);
		});
	});
