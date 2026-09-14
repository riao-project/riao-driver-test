import 'jasmine';
import {
	columnName,
	ColumnType,
	Database,
	DatabaseFunctions,
	QueryRepository,
} from '@riao/dbal';
import { TestDependencies } from '../../dependency-injection';

interface DayTestRecord {
	id: number;
	name: string;
	create_timestamp: string | Date;
}

export const dayTest = (di: TestDependencies) =>
	describe('Day()', () => {
		let db: Database;
		let repo: QueryRepository<DayTestRecord>;
		const table = 'dayfn_test';

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

		it('can select day from column', async () => {
			const results: any = await repo.findOne({
				columns: [
					'name',
					{
						query: DatabaseFunctions.day(
							columnName('create_timestamp')
						),
						as: 'day',
					},
				],
				where: { id: 3 },
			});

			expect(+results.day).toEqual(5);
		});

		it('can select day from different dates', async () => {
			const results: any = await repo.find({
				columns: [
					'name',
					{
						query: DatabaseFunctions.day(
							columnName('create_timestamp')
						),
						as: 'day',
					},
				],
			});

			expect(results.length).toEqual(3);
			expect(+results[0].day).toEqual(3); // 2024-02-03
			expect(+results[1].day).toEqual(7); // 2023-06-07
			expect(+results[2].day).toEqual(5); // 2022-04-05
		});
	});
