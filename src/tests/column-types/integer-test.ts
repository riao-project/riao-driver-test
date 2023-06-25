import 'jasmine';
import { ColumnType, Database } from 'riao-dbal/src';
import { TestDependencies } from '../../dependency-injection';

export const integerTest = (di: TestDependencies) =>
	describe('Data Types - Integer', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
		});

		const integerTest = async (
			columnType: ColumnType,
			max: number | bigint
		) => {
			const table = columnType.toLowerCase() + '_column_test';

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: <any>columnType,
						name: 'n_numbers',
					},
				],
			});

			await db.query.insert({
				table,
				records: [{ n_numbers: max }],
			});

			const records = await db.query.find({
				table,
				where: {
					n_numbers: max,
				},
			});

			if (columnType === ColumnType.BIGINT) {
				records[0].n_numbers = BigInt(records[0].n_numbers);
			}

			expect(records.length).toEqual(1);
			expect(records[0].n_numbers).toEqual(max);
		};

		it('supports tinyint column', async () => {
			await integerTest(ColumnType.TINYINT, 127);
		});

		it('supports small int column', async () => {
			await integerTest(ColumnType.SMALLINT, 32767);
		});

		it('supports int column', async () => {
			await integerTest(ColumnType.INT, 2147483647);
		});

		it('supports big-int column', async () => {
			await integerTest(ColumnType.BIGINT, BigInt('9223372036854775807'));
		});
	});
