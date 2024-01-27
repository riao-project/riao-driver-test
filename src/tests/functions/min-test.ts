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

export const minTest = (di: TestDependencies) =>
	describe('Min()', () => {
		let db: Database;
		let users: QueryRepository<User>;

		beforeAll(() => {
			db = di.db();
			users = di.repo();
		});

		it('can select min number literal', async () => {
			const results: any = await users.findOne({
				columns: [
					{
						query: DatabaseFunctions.min(1),
						as: 'min',
					},
				],
			});

			expect(+results.min).toEqual(1);
		});

		it('can select min column', async () => {
			const results: any = await users.findOne({
				columns: [
					{
						query: DatabaseFunctions.min(columnName('myid')),
						as: 'min',
					},
				],
			});

			expect(+results.min).toEqual(1);
		});

		it('can select min function', async () => {
			const results: any = await users.findOne({
				columns: [
					{
						query: DatabaseFunctions.min(
							DatabaseFunctions.currentTimestamp()
						),
						as: 'min',
					},
				],
			});

			expect(results.min.toString().length).toBeGreaterThanOrEqual(5);
		});
	});
