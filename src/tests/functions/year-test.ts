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

export const yearTest = (di: TestDependencies) =>
	describe('Year()', () => {
		let db: Database;
		let users: QueryRepository<User>;

		beforeAll(() => {
			db = di.db();
			users = di.repo();
		});

		it('can select year', async () => {
			const results: any = await users.findOne({
				columns: [
					{
						query: DatabaseFunctions.year(
							DatabaseFunctions.currentTimestamp()
						),
						as: 'year',
					},
				],
			});

			expect(+results.year).toEqual(new Date().getFullYear());
		});
	});
