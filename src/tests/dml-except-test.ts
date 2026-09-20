import 'jasmine';
import { ColumnType, Database, QueryRepository } from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';

interface SimpleRecord {
	id: number;
	name: string;
}

export const dmlExceptTest = (di: TestDependencies) =>
	describe('Query except()', () => {
		let db: Database;
		let table1: QueryRepository<SimpleRecord>;
		let table2: QueryRepository<SimpleRecord>;
		const databaseType = di.options().name;

		const supportsExcept = (): boolean => !databaseType.includes('MySQL 5');

		const supportsExceptAll = (): boolean =>
			databaseType.includes('Postgres') ||
			databaseType.includes('MySQL 8');

		beforeAll(async () => {
			db = di.db();

			await db.ddl.createTable({
				name: 'except_test_table1',
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

			await db.ddl.createTable({
				name: 'except_test_table2',
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
				table: 'except_test_table1',
			});
			table2 = db.getQueryRepository<SimpleRecord>({
				table: 'except_test_table2',
			});

			await table1.insert({
				records: [
					{ name: 'Alice' },
					{ name: 'Bob' },
					{ name: 'Charlie' },
					{ name: 'Bob' },
				],
			});
			await table2.insert({
				records: [
					{ name: 'Bob' },
					{ name: 'Charlie' },
					{ name: 'David' },
				],
			});
		});

		it('can perform basic except - returns only left-side values', async () => {
			if (!supportsExcept()) {
				pending('Database does not support EXCEPT');
				return;
			}

			const results = await db.query.find({
				columns: ['name'],
				table: 'except_test_table1',
				except: [
					{
						query: {
							columns: ['name'],
							table: 'except_test_table2',
						},
					},
				],
			});

			expect(results.map((record: any) => record.name)).toEqual([
				'Alice',
			]);
		});

		it('can perform except all and preserve unmatched duplicates', async () => {
			if (!supportsExceptAll()) {
				pending('Database does not support EXCEPT ALL');
				return;
			}

			const query = db
				.getQueryBuilder()
				.select({
					columns: ['name'],
					table: 'except_test_table1',
				})
				.exceptAll({
					columns: ['name'],
					table: 'except_test_table2',
				})
				.toDatabaseQuery();

			const results = await db.driver.query(query);
			const names = results.results
				?.map((record: any) => record.name)
				.sort();

			// Bob occurs twice on the left and once on the right, so one remains.
			expect(names).toEqual(['Alice', 'Bob']);
		});

		it('can apply a where clause to the right-side query', async () => {
			if (!supportsExcept()) {
				pending('Database does not support EXCEPT');
				return;
			}

			const results = await db.query.find({
				columns: ['name'],
				table: 'except_test_table1',
				except: [
					{
						query: {
							columns: ['name'],
							table: 'except_test_table2',
							where: { name: 'Bob' },
						},
					},
				],
			});

			const names = results.map((record: any) => record.name).sort();
			expect(names).toEqual(['Alice', 'Charlie']);
		});

		it('can generate correct SQL for except and except all', () => {
			if (!supportsExcept()) {
				pending('Database does not support EXCEPT');
				return;
			}

			const builder = db.getQueryBuilder().select({
				columns: ['name'],
				table: 'except_test_table1',
			});
			const exceptSql = builder
				.except({ columns: ['name'], table: 'except_test_table2' })
				.toDatabaseQuery().sql;

			expect(exceptSql).toContain('EXCEPT');
			expect(exceptSql).not.toContain('EXCEPT ALL');

			if (!supportsExceptAll()) {
				return;
			}

			const exceptAllSql = db
				.getQueryBuilder()
				.select({
					columns: ['name'],
					table: 'except_test_table1',
				})
				.exceptAll({
					columns: ['name'],
					table: 'except_test_table2',
				})
				.toDatabaseQuery().sql;

			expect(exceptAllSql).toContain('EXCEPT ALL');
		});
	});
