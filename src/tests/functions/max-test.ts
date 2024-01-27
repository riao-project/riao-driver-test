import 'jasmine';
import {
	ColumnType,
	Database,
	DatabaseFunctions,
	QueryRepository,
	columnName,
	gt,
} from '@riao/dbal';
import { TestDependencies } from '../../dependency-injection';
import { User } from '../../dml-data';

export const maxTest = (di: TestDependencies) =>
	describe('Max()', () => {
		let db: Database;
		let users: QueryRepository<User>;

		beforeAll(() => {
			db = di.db();
			users = di.repo();
		});

		it('can select max number literal', async () => {
			const results: any = await users.findOne({
				columns: [
					{
						query: DatabaseFunctions.max(1),
						as: 'max',
					},
				],
			});

			expect(+results.max).toEqual(1);
		});

		it('can select max column', async () => {
			const results: any = await users.findOne({
				columns: [
					{
						query: DatabaseFunctions.max(columnName('myid')),
						as: 'max',
					},
				],
			});

			expect(+results.max).toBeGreaterThanOrEqual(3);
		});

		it('can select max function', async () => {
			const results: any = await users.findOne({
				columns: [
					{
						query: DatabaseFunctions.max(
							DatabaseFunctions.currentTimestamp()
						),
						as: 'max',
					},
				],
			});

			expect(results.max.toString().length).toBeGreaterThanOrEqual(5);
		});
	});
