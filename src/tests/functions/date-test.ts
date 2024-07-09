import 'jasmine';
import {
	columnName,
	ColumnType,
	Database,
	DatabaseFunctions,
	QueryRepository,
} from '@riao/dbal';
import { TestDependencies } from '../../dependency-injection';

interface DateTestRecord {
	id: number;
	name: string;
	create_timestamp: string | Date;
}

export const dateTest = (di: TestDependencies) =>
	describe('Date()', () => {
		let db: Database;
		let repo: QueryRepository<DateTestRecord>;
		const table = 'datefn_test';

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

		it('can select date from column', async () => {
			const results: any = await repo.findOne({
				columns: [
					'name',
					{
						query: DatabaseFunctions.date(
							columnName('create_timestamp')
						),
						as: 'tt',
					},
				],
				where: { id: 3 },
			});

			const date = new Date(results.tt);

			expect(date.toISOString()).toEqual(
				new Date('2022-04-05').toISOString()
			);
		});
	});
