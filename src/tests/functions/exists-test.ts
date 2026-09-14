import 'jasmine';
import {
	and,
	ColumnType,
	Database,
	exists,
	notExists,
	QueryRepository,
	Subquery,
	raw,
	gt,
} from '@riao/dbal';
import { TestDependencies } from '../../dependency-injection';

interface User {
	id: number;
	name: string;
}

interface Order {
	id: number;
	user_id: number;
	amount: number;
}

export const existsTest = (di: TestDependencies) =>
	describe('EXISTS and NOT EXISTS', () => {
		let db: Database;
		let users: QueryRepository<User>;
		let orders: QueryRepository<Order>;

		beforeAll(async () => {
			db = di.db();

			await db.ddl.createTable({
				name: 'exists_test_users',
				columns: [
					{
						name: 'id',
						type: ColumnType.INT,
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
				name: 'exists_test_orders',
				columns: [
					{
						name: 'id',
						type: ColumnType.INT,
						primaryKey: true,
						autoIncrement: true,
					},
					{
						name: 'user_id',
						type: ColumnType.INT,
					},
					{
						name: 'amount',
						type: ColumnType.DECIMAL,
						significant: 10,
						decimal: 2,
					},
				],
				foreignKeys: [
					{
						columns: ['user_id'],
						referencesTable: 'exists_test_users',
						referencesColumns: ['id'],
					},
				],
			});

			users = db.getQueryRepository<User>({
				table: 'exists_test_users',
			});

			orders = db.getQueryRepository<Order>({
				table: 'exists_test_orders',
			});

			// Insert test data
			await users.insert({
				records: [
					{ name: 'Alice' },
					{ name: 'Bob' },
					{ name: 'Charlie' },
				],
			});

			await orders.insert({
				records: [
					{ user_id: 1, amount: 100.0 },
					{ user_id: 1, amount: 200.0 },
					{ user_id: 2, amount: 150.0 },
					// Charlie (id: 3) has no orders
				],
			});
		});
    
		it('can select where exists with subquery checking for user_id=1', async () => {
			const results: any = await users.find({
				where: exists(
					new Subquery({
						table: 'exists_test_orders',
						where: { user_id: 1 },
					})
				),
			});

			expect(results.length).toEqual(3); // All users since orders exist with user_id=1
		});

		it('can select where not exists with subquery checking for non-existent user_id', async () => {
			const results: any = await users.find({
				where: notExists(
					new Subquery({
						table: 'exists_test_orders',
						where: { user_id: 99 },
					})
				),
			});

			expect(results.length).toEqual(3); // All users since no orders with user_id=99
		});

		it('can select where exists with additional and condition', async () => {
			const results: any = await users.find({
				where: [
					exists(
						new Subquery({
							table: 'exists_test_orders',
							where: { user_id: 1 },
						})
					),
					and,
					{ name: 'Alice' },
				],
			});

			expect(results.length).toEqual(1);
			expect(results[0].name).toEqual('Alice');
		});

		it('can select where exists with amount condition in subquery', async () => {
			const results: any = await users.find({
				where: exists(
					new Subquery({
						table: 'exists_test_orders',
						where: { amount: gt(150.0) },
					})
				),
			});

			expect(results.length).toEqual(3); // All users since orders > 150 exist
		});

		it('can select where not exists with amount condition in subquery', async () => {
			const results: any = await users.find({
				where: notExists(
					new Subquery({
						table: 'exists_test_orders',
						where: { amount: gt(500.0) },
					})
				),
			});

			expect(results.length).toEqual(3); // All users since no orders > 500
		});
	});
