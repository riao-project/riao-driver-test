import 'jasmine';
import { ColumnType, Database, QueryRepository } from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';

interface SimpleRecord {
	id: number;
	name: string;
}

export const dmlIntersectTest = (di: TestDependencies) =>
	describe('Query intersect()', () => {
		let db: Database;
		let table1: QueryRepository<SimpleRecord>;
		let table2: QueryRepository<SimpleRecord>;
		const databaseType = di.options().name;

		const supportsIntersect = (database: Database): boolean =>
			// MSSQL doesn't support INTERSECT before 8.0.31
			!databaseType.includes('MySQL 5');

		const supportsIntersectAll = (database: Database): boolean => (
			// MSSQL doesn't support INTERSECT ALL
			!databaseType.includes('MsSQL') &&
			// MSSQL doesn't support INTERSECT before 8.0.31
			!databaseType.includes('MySQL 5') &&
			// SQLite doesn't support INTERSECT ALL
			!databaseType.includes('Sqlite')
		);

		beforeAll(async () => {
			db = di.db();

			// Create first test table
			await db.ddl.createTable({
				name: 'intersect_test_table1',
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
				name: 'intersect_test_table2',
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
				table: 'intersect_test_table1',
			});

			table2 = db.getQueryRepository<SimpleRecord>({
				table: 'intersect_test_table2',
			});

			// Insert test data
			// table1: Alice, Bob, Charlie
			await table1.insert({
				records: [
					{ name: 'Alice' },
					{ name: 'Bob' },
					{ name: 'Charlie' },
				],
			});

			// table2: Bob, Charlie, David (Bob and Charlie overlap)
			await table2.insert({
				records: [
					{ name: 'Bob' },
					{ name: 'Charlie' },
					{ name: 'David' },
				],
			});
		});

		it('can perform basic intersect - returns only common values', async () => {
			if (!supportsIntersect(db)) {
				pending('Database does not support INTERSECT');
				return;
			}

			const query = db
				.getQueryBuilder()
				.select({
					columns: ['name'],
					table: 'intersect_test_table1',
				})
				.intersect({
					columns: ['name'],
					table: 'intersect_test_table2',
				})
				.toDatabaseQuery();

			const results = await db.driver.query(query);

			expect(results.results?.length).toEqual(2); // Bob and Charlie
			const names = results.results?.map((r: any) => r.name).sort();
			expect(names).toEqual(['Bob', 'Charlie']);
		});

		it('can perform intersect all - returns common values with duplicates', async () => {
			if (!supportsIntersectAll(db)) {
				pending('Database does not support INTERSECT ALL');
				return;
			}

			// First, we need to insert duplicate data
			await table1.insert({
				records: [{ name: 'Bob' }], // Add another Bob to table1
			});

			const query = db
				.getQueryBuilder()
				.select({
					columns: ['name'],
					table: 'intersect_test_table1',
				})
				.intersectAll({
					columns: ['name'],
					table: 'intersect_test_table2',
				})
				.toDatabaseQuery();

			const results = await db.driver.query(query);

			// INTERSECT ALL should return:
			// - Charlie (appears once in both tables)
			// - Bob (appears twice in table1, once in table2, so min(2,1)=1)
			// Actually, INTERSECT ALL returns the minimum count of matching rows
			// table1 has: Alice, Bob, Charlie, Bob (2 Bobs)
			// table2 has: Bob, Charlie, David (1 Bob)
			// Result: min(2,1)=1 Bob, min(1,1)=1 Charlie = 2 total
			const names = results.results?.map((r: any) => r.name).sort();
			expect(names).toContain('Bob');
			expect(names).toContain('Charlie');
		});

		it('can perform intersect with no common values', async () => {
			if (!supportsIntersect(db)) {
				pending('Database does not support INTERSECT');
				return;
			}

			// Create a third table with no overlapping data
			await db.ddl.createTable({
				name: 'intersect_test_table3',
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

			const table3 = db.getQueryRepository<SimpleRecord>({
				table: 'intersect_test_table3',
			});

			await table3.insert({
				records: [{ name: 'Eve' }, { name: 'Frank' }],
			});

			const query = db
				.getQueryBuilder()
				.select({
					columns: ['name'],
					table: 'intersect_test_table1',
				})
				.intersect({
					columns: ['name'],
					table: 'intersect_test_table3',
				})
				.toDatabaseQuery();

			const results = await db.driver.query(query);

			expect(results.results?.length).toEqual(0);
		});

		it('can perform intersect with where clause in first query', async () => {
			if (!supportsIntersect(db)) {
				pending('Database does not support INTERSECT');
				return;
			}

			const query = db
				.getQueryBuilder()
				.select({
					columns: ['name'],
					table: 'intersect_test_table1',
					where: { name: 'Bob' },
					intersect: [
						{
							query: {
								columns: ['name'],
								table: 'intersect_test_table2',
							},
						},
					],
				})
				.toDatabaseQuery();

			const results = await db.driver.query(query);

			// First query returns: Bob (and the second Bob we added)
			// Second query returns: Bob, Charlie, David
			// Intersection: Bob
			const names = results.results?.map((r: any) => r.name);
			expect(names).toContain('Bob');
			expect(names).not.toContain('Charlie');
		});

		it('can perform intersect with where clause in second query', async () => {
			if (!supportsIntersect(db)) {
				pending('Database does not support INTERSECT');
				return;
			}

			const query = db
				.getQueryBuilder()
				.select({
					columns: ['name'],
					table: 'intersect_test_table1',
					intersect: [
						{
							query: {
								columns: ['name'],
								table: 'intersect_test_table2',
								where: { name: 'Bob' },
							},
						},
					],
				})
				.toDatabaseQuery();

			const results = await db.driver.query(query);

			// First query returns: Alice, Bob, Charlie, Bob
			// Second query returns: Bob
			// Intersection: Bob
			const names = results.results?.map((r: any) => r.name);
			expect(names).toContain('Bob');
			expect(names).not.toContain('Alice');
			expect(names).not.toContain('Charlie');
		});

		it('can generate correct SQL for intersect', () => {
			if (!supportsIntersect(db)) {
				pending('Database does not support INTERSECT');
				return;
			}

			const { sql } = db
				.getQueryBuilder()
				.select({
					columns: ['name'],
					table: 'intersect_test_table1',
				})
				.intersect({
					columns: ['name'],
					table: 'intersect_test_table2',
				})
				.toDatabaseQuery();

			expect(sql).toContain('INTERSECT');
			expect(sql).not.toContain('INTERSECT ALL');
		});

		it('can generate correct SQL for intersect all', () => {
			if (!supportsIntersectAll(db)) {
				pending('Database does not support INTERSECT ALL');
				return;
			}

			const { sql } = db
				.getQueryBuilder()
				.select({
					columns: ['name'],
					table: 'intersect_test_table1',
				})
				.intersectAll({
					columns: ['name'],
					table: 'intersect_test_table2',
				})
				.toDatabaseQuery();

			expect(sql).toContain('INTERSECT ALL');
		});

		it('can perform intersect with all columns', async () => {
			if (!supportsIntersect(db)) {
				pending('Database does not support INTERSECT');
				return;
			}

			const query = db
				.getQueryBuilder()
				.select({
					table: 'intersect_test_table1',
				})
				.intersect({
					table: 'intersect_test_table2',
				})
				.toDatabaseQuery();

			const results = await db.driver.query(query);

			// Should return rows where both id and name match
			// Since the tables have different auto-increment sequences,
			// there should be no matches
			expect(results.results?.length).toEqual(0);
		});

		it('can perform multiple intersects in sequence', async () => {
			if (!supportsIntersect(db)) {
				pending('Database does not support INTERSECT');
				return;
			}

			// Create a third table
			await db.ddl.createTable({
				name: 'intersect_test_table4',
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

			const table4 = db.getQueryRepository<SimpleRecord>({
				table: 'intersect_test_table4',
			});

			// Insert Bob and Charlie (matching both previous tables)
			await table4.insert({
				records: [{ name: 'Bob' }, { name: 'Charlie' }],
			});

			const query = db
				.getQueryBuilder()
				.select({
					columns: ['name'],
					table: 'intersect_test_table1',
				})
				.intersect({
					columns: ['name'],
					table: 'intersect_test_table2',
				})
				.intersect({
					columns: ['name'],
					table: 'intersect_test_table4',
				})
				.toDatabaseQuery();

			const results = await db.driver.query(query);

			// table1 ∩ table2 = {Bob, Charlie}
			// {Bob, Charlie} ∩ table4 = {Bob, Charlie}
			const names = results.results?.map((r: any) => r.name).sort();
			expect(names).toEqual(['Bob', 'Charlie']);
		});
	});
