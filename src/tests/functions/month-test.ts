import 'jasmine';
import {
	columnName,
	ColumnType,
	Database,
	DatabaseFunctions,
	QueryRepository,
} from '@riao/dbal';
import { TestDependencies } from '../../dependency-injection';

interface MonthTestRecord {
	id: number;
	name: string;
	create_timestamp: string | Date;
}

export const monthTest = (di: TestDependencies) =>
	describe('Month()', () => {
		let db: Database;
		let repo: QueryRepository<MonthTestRecord>;
		const table = 'monthfn_test';

		beforeAll(async () => {
			db = di.db();
			await db.getDataDefinitionRepository().createTable({
				name: table,
				columns: [
					{
						name: 'id',
						type: ColumnType.INT,
						autoIncrement: true,
						primaryKey: true,
					},
					{
						name: 'name',
						type: ColumnType.TEXT,
					},
					{
						name: 'create_timestamp',
						type: ColumnType.TIMESTAMP,
						default: DatabaseFunctions.currentTimestamp(),
					},
				],
			});

			repo = db.getQueryRepository({ table });

			await repo.insert({
				records: [
					{ name: 'First', create_timestamp: '2024-02-03 07:32:35' },
					{ name: 'Second', create_timestamp: '2023-06-07 06:45:45' },
					{ name: 'Third', create_timestamp: '2022-04-05 02:15:23' },
				],
			});
		});

		it('can select month from column', async () => {
			const results: any = await repo.findOne({
				columns: [
					'name',
					{
						query: DatabaseFunctions.month(
							columnName('create_timestamp')
						),
						as: 'month',
					},
				],
				where: { id: 3 },
			});

			expect(+results.month).toEqual(4);
		});

		it('can select month from different dates', async () => {
			const results: any = await repo.find({
				columns: [
					'name',
					{
						query: DatabaseFunctions.month(
							columnName('create_timestamp')
						),
						as: 'month',
					},
				],
			});

			expect(results.length).toEqual(3);
			expect(+results[0].month).toEqual(2); // 2024-02-03
			expect(+results[1].month).toEqual(6); // 2023-06-07
			expect(+results[2].month).toEqual(4); // 2022-04-05
		});
	});
