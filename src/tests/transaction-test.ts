import 'jasmine';
import { ColumnType, Database, QueryRepository } from '@riao/dbal';
import { TestDependencies } from '../dependency-injection';
import { Transaction } from '@riao/dbal/database/transaction';

export const transactionTest = (di: TestDependencies) =>
	describe('Transaction', () => {
		let db: Database;

		beforeAll(async () => {
			db = di.db();

			await db.ddl.createTable({
				name: 'transaction_test',
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
		});

		it('rolls back if an exception is thrown', async () => {
			try {
				await db.transaction(async (transaction: Transaction) => {
					await transaction.query.insert({
						table: 'transaction_test',
						records: [{ name: 'Exception' }],
					});

					throw new Error(
						'Throwing an error to roll back the transaction!'
					);
				});
			}
			catch (e) {}

			const rows = await db.query.find({
				table: 'transaction_test',
				where: { name: 'Exception' },
			});

			expect(rows.length).toEqual(0);
		});

		it('can insert rows', async () => {
			await db.transaction(async (transaction: Transaction) => {
				await transaction.query.insert({
					table: 'transaction_test',
					records: [{ name: 'Inserted' }],
				});
			});

			const rows = await db.query.find({
				table: 'transaction_test',
				where: { name: 'Inserted' },
			});

			expect(rows.length).toEqual(1);
		});
	});
