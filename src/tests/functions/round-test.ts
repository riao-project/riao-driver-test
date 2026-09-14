import 'jasmine';
import {
	ColumnType,
	Database,
	DatabaseFunctions,
	QueryRepository,
	columnName,
} from '@riao/dbal';
import { TestDependencies } from '../../dependency-injection';

interface RoundTestRecord {
	id: number;
	value: number;
	amount: number;
}

export const roundTest = (di: TestDependencies) =>
	describe('Round()', () => {
		let db: Database;
		let repo: QueryRepository<RoundTestRecord>;
		const table = 'round_test';

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
						name: 'value',
						type: ColumnType.DECIMAL,
						significant: 10,
						decimal: 4,
					},
					{
						name: 'amount',
						type: ColumnType.DECIMAL,
						significant: 10,
						decimal: 2,
					},
				],
			});

			repo = db.getQueryRepository({ table });

			await repo.insert({
				records: [
					{ value: 123.456, amount: 99.99 },
					{ value: 45.6789, amount: 50.505 },
					{ value: 7.1234, amount: 25.251 },
					{ value: 999.9999, amount: 1000.005 },
				],
			});
		});

		it('can select round with number literal and no decimals', async () => {
			const results: any = await repo.findOne({
				columns: [
					{
						query: DatabaseFunctions.round(123.456),
						as: 'rounded',
					},
				],
			});

			expect(+results.rounded).toEqual(123);
		});

		it('can select round with number literal and decimals', async () => {
			const results: any = await repo.findOne({
				columns: [
					{
						query: DatabaseFunctions.round(123.456, 2),
						as: 'rounded',
					},
				],
			});

			expect(+results.rounded).toEqual(123.46);
		});

		it('can select round from column with no decimals', async () => {
			const results: any = await repo.find({
				columns: [
					'id',
					{
						query: DatabaseFunctions.round(columnName('value')),
						as: 'rounded',
					},
				],
			});

			expect(results.length).toEqual(4);
			expect(+results[0].rounded).toEqual(123); // 123.456
			expect(+results[1].rounded).toEqual(46); // 45.6789
			expect(+results[2].rounded).toEqual(7); // 7.1234
			expect(+results[3].rounded).toEqual(1000); // 999.9999
		});

		it('can select round from column with decimals', async () => {
			const results: any = await repo.find({
				columns: [
					'id',
					{
						query: DatabaseFunctions.round(columnName('value'), 2),
						as: 'rounded',
					},
				],
			});

			expect(results.length).toEqual(4);
			expect(+results[0].rounded).toEqual(123.46); // 123.456
			expect(+results[1].rounded).toEqual(45.68); // 45.6789
			expect(+results[2].rounded).toEqual(7.12); // 7.1234
			expect(+results[3].rounded).toEqual(1000.0); // 999.9999
		});

		it('can select round with one decimal place', async () => {
			const results: any = await repo.find({
				columns: [
					'id',
					{
						query: DatabaseFunctions.round(columnName('amount'), 1),
						as: 'rounded',
					},
				],
			});

			expect(results.length).toEqual(4);
			expect(+results[0].rounded).toEqual(100.0); // 99.99
			expect(+results[1].rounded).toEqual(50.5); // 50.505
			expect(+results[2].rounded).toEqual(25.3); // 25.251
			expect(+results[3].rounded).toEqual(1000.0); // 1000.005
		});

		it('can select round with zero decimals', async () => {
			const results: any = await repo.find({
				columns: [
					'id',
					{
						query: DatabaseFunctions.round(columnName('amount'), 0),
						as: 'rounded',
					},
				],
			});

			expect(results.length).toEqual(4);
			expect(+results[0].rounded).toEqual(100); // 99.99
			expect(+results[1].rounded).toEqual(51); // 50.505
			expect(+results[2].rounded).toEqual(25); // 25.251
			expect(+results[3].rounded).toEqual(1000); // 1000.005
		});
	});
