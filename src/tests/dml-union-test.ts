import 'jasmine';
import {
	ColumnType,
	Database,
	QueryRepository,
} from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';

interface SimpleRecord {
	id: number;
	name: string;
}

export const dmlUnionTest = (di: TestDependencies) =>
	describe('Query union()', () => {
		let db: Database;
		let table1: QueryRepository<SimpleRecord>;
		let table2: QueryRepository<SimpleRecord>;

		beforeAll(async () => {
			db = di.db();

			// Create first test table
			await db.ddl.createTable({
				name: 'union_test_table1',
				columns: [
					{
						name: 'id',
						type: ColumnType.BIGINT,
						primaryKey: true,
						autoIncrement: true,
					},
					{
						name: 'name',
						type: ColumnType.VARCHAR,
						length: 255,
					},
				],
			});

			// Create second test table
			await db.ddl.createTable({
				name: 'union_test_table2',
				columns: [
					{
						name: 'id',
						type: ColumnType.BIGINT,
						primaryKey: true,
						autoIncrement: true,
					},
					{
						name: 'name',
						type: ColumnType.VARCHAR,
						length: 255,
					},
				],
			});

			table1 = db.getQueryRepository<SimpleRecord>({
				table: 'union_test_table1',
			});

			table2 = db.getQueryRepository<SimpleRecord>({
				table: 'union_test_table2',
			});

			// Insert test data
			await table1.insert({
				records: [
					{ name: 'Alice' },
					{ name: 'Bob' },
					{ name: 'Charlie' },
				],
			});

			await table2.insert({
				records: [
					{ name: 'Bob' },
					{ name: 'David' },
					{ name: 'Eve' },
				],
			});
		});

		it('can perform basic union', async () => {
			const results = await db.query.find({
				columns: ['name'],
				table: 'union_test_table1',
				union: [
					{
						query: {
							columns: ['name'],
							table: 'union_test_table2',
						},
					},
				],
			});

			// UNION removes duplicates, so Bob should appear only once
			expect(results.length).toEqual(5);
			const names = results.map((r: any) => r.name).sort();
			expect(names).toContain('Alice');
			expect(names).toContain('Bob');
			expect(names).toContain('Charlie');
			expect(names).toContain('David');
			expect(names).toContain('Eve');
		});

		it('can perform union all', async () => {
			const results = await db.query.find({
				columns: ['name'],
				table: 'union_test_table1',
				union: [
					{
						query: {
							columns: ['name'],
							table: 'union_test_table2',
						},
						all: true,
					},
				],
			});

			// UNION ALL keeps duplicates, so we should have 6 results
			expect(results.length).toEqual(6);
			const names = results.map((r: any) => r.name);
			const bobCount = names.filter((n: string) => n === 'Bob').length;
			expect(bobCount).toEqual(2);
		});

		it('can perform multiple unions', async () => {
			const results = await db.query.find({
				columns: ['name'],
				table: 'union_test_table1',
				union: [
					{
						query: {
							columns: ['name'],
							table: 'union_test_table2',
						},
					},
					{
						query: {
							columns: ['name'],
							table: 'union_test_table1',
						},
						all: true,
					},
				],
			});

			// First UNION removes duplicates between table1 and table2
			// Then UNION ALL adds table1 results again
			expect(results.length).toBeGreaterThanOrEqual(5);
		});

		it('can perform union with where clause in first query', async () => {
			const results = await db.query.find({
				columns: ['name'],
				table: 'union_test_table1',
				where: { name: 'Bob' },
				union: [
					{
						query: {
							columns: ['name'],
							table: 'union_test_table2',
						},
					},
				],
			});

			// Should have results from first table where name='Bob'
			// plus all unique results from second table
			expect(results.length).toBeGreaterThan(0);
			const names = results.map((r: any) => r.name);
			expect(names).toContain('Bob');
		});

		it('can perform union with where clause in second query', async () => {
			const results = await db.query.find({
				columns: ['name'],
				table: 'union_test_table1',
				union: [
					{
						query: {
							columns: ['name'],
							table: 'union_test_table2',
							where: { name: 'David' },
						},
					},
				],
			});

			// Should have all results from first table
			// plus only David from second table
			expect(results.length).toBeGreaterThan(0);
			const names = results.map((r: any) => r.name);
			expect(names).toContain('Alice');
			expect(names).toContain('David');
		});

		it('can perform union with both id and name columns', async () => {
			const results = await db.query.find({
				columns: ['id', 'name'],
				table: 'union_test_table1',
				union: [
					{
						query: {
							columns: ['id', 'name'],
							table: 'union_test_table2',
						},
					},
				],
			});

			// With auto-increment, table1 has IDs 1-3 and table2 has IDs 1-3
			// So we get 6 unique rows when considering both id and name
			expect(results.length).toEqual(6);
			// Check that all results have both id and name properties
			results.forEach((record: any) => {
				expect(record.id).toBeDefined();
				expect(record.name).toBeDefined();
			});
			// Collect all names from both tables
			const names = results.map((r: any) => r.name);
			expect(names).toContain('Alice');
			expect(names).toContain('Bob');
			expect(names).toContain('Charlie');
			expect(names).toContain('David');
			expect(names).toContain('Eve');
		});

		it('can perform union all with multiple queries', async () => {
			const results = await db.query.find({
				columns: ['name'],
				table: 'union_test_table1',
				union: [
					{
						query: {
							columns: ['name'],
							table: 'union_test_table2',
						},
						all: true,
					},
					{
						query: {
							columns: ['name'],
							table: 'union_test_table1',
						},
						all: true,
					},
				],
			});

			// Should have 9 total results (3+3+3 with all duplicates)
			expect(results.length).toEqual(9);
		});

		it('can perform union mixing union and union all', async () => {
			const results = await db.query.find({
				columns: ['name'],
				table: 'union_test_table1',
				union: [
					{
						query: {
							columns: ['name'],
							table: 'union_test_table2',
						},
						all: false,
					},
					{
						query: {
							columns: ['name'],
							table: 'union_test_table1',
						},
						all: true,
					},
				],
			});

			// First UNION (no all) removes duplicates, then UNION ALL adds table1 again
			expect(results.length).toBeGreaterThan(0);
		});
	});
