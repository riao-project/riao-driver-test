import { ColumnOptions, ColumnType, Database } from '@riao/dbal';
import { NameColumn } from '@riao/dbal/column-pack';

import { TestDependencies } from '../../../dependency-injection';

export type IntegerColumnTypes = ColumnType &
	(
		| ColumnType.BIGINT
		| ColumnType.INT
		| ColumnType.SMALLINT
		| ColumnType.TINYINT
	);

export function integerTypesTests(
	di: TestDependencies,
	columnType: IntegerColumnTypes,
	max: number | bigint
) {
	if (
		columnType === ColumnType.BIGINT &&
		di.options().name.includes('Sqlite')
	) {
		console.warn(
			'Large bigint not supported by db driver (better-sqlite3).'
		);
		max = BigInt('922337203685477');
	}

	const maxValue: number | bigint = max;
	const minValue: number | bigint = -max;

	// if (columnType === ColumnType.BIGINT) {
	// 	zeroValue = BigInt(zeroValue);
	// 	maxValue = BigInt(maxValue);
	// 	minValue = BigInt('-' + max);
	// }

	return describe('Data Types - ' + columnType, () => {
		let db: Database;
		const table = getTableName('');

		beforeAll(async () => {
			db = di.db();

			await db.ddl.createTable({
				name: table,
				columns: [NameColumn, defaultColumn()],
			});
		});

		// it('can create column', async () => {
		// 	const table = getTableName('create_col');

		// 	await createTable({
		// 		table,
		// 	});
		// });

		it('can insert records', async () => {
			const name = 'insert_records_test';

			await db.query.insert({
				table,
				records: [{ name, num: BigInt(5) }],
			});

			const records = await db.query.find({ table, where: { name } });

			expect(records.length).toEqual(1);
			expectValue(5, records[0].num);
		});

		it('can insert min value', async () => {
			const name = 'insert_min_value_test';

			await db.query.insert({
				table,
				records: [{ name, num: minValue }],
			});

			const records = await db.query.find({ table, where: { name } });

			expect(records.length).toEqual(1);
			expectValue(minValue, records[0].num);
		});

		it('can insert max value', async () => {
			const name = 'insert_max_value_test';

			await db.query.insert({
				table,
				records: [{ name, num: maxValue }],
			});

			const records = await db.query.find({ table, where: { name } });

			expect(records.length).toEqual(1);
			expectValue(maxValue, records[0].num);
		});

		it('can insert auto increment value', async () => {
			const table = getTableName('insert_auto_increment_value');

			await createTable({
				table,
				columns: [
					{
						name: 'num',
						type: columnType,
						autoIncrement: true,
						primaryKey: true,
					},
					NameColumn,
				],
			});

			await db.query.insert({
				table,
				records: [{ name: 'a' }],
			});

			const records = await db.query.find({ table });

			expect(records.length).toEqual(1);
			expectValue(1, records[0].num);
		});

		it('can insert null value', async () => {
			const name = 'insert_null_value_test';

			await db.query.insert({
				table,
				records: [{ name, num: null }],
			});

			const records = await db.query.find({ table, where: { name } });

			expect(records.length).toEqual(1);
			expect(records[0].num).toBeNull();
		});

		it('can default to a value', async () => {
			await defaultValueTest(12, 'value');
		});

		it('can default to null', async () => {
			await defaultValueTest(null, 'null');
		});

		it('can default to min value', async () => {
			await defaultValueTest(minValue, 'min_value');
		});

		it('can default to max value', async () => {
			await defaultValueTest(maxValue, 'max_value');
		});

		function expectValue(
			expected: number | bigint,
			actual: null | number | bigint
		) {
			if (columnType === ColumnType.BIGINT) {
				expected = expected ? BigInt(expected as number) : expected;
				actual = actual ? BigInt(actual as number) : actual;
			}

			expect(actual).toEqual(expected);
		}

		async function defaultValueTest(
			defaultValue: null | number | bigint,
			name: string
		) {
			const table = getTableName('default_' + name);

			await createTable({
				table,
				columns: [
					{
						type: columnType,
						name: 'num',
						default: defaultValue,
					},
					NameColumn,
				],
			});

			await db.query.insert({
				table,
				records: [{ name: 'test' }],
			});

			const records = await db.query.find({ table });

			expect(records.length).toEqual(1);
			expectValue(defaultValue, records[0].num);
		}

		function getTableName(name: string) {
			return 'columns_integers_' + columnType.toLowerCase() + '_' + name;
		}

		function defaultColumn(): ColumnOptions {
			return {
				type: columnType,
				name: 'num',
			};
		}

		async function createTable(options: {
			table: string;
			columns?: ColumnOptions[];
		}) {
			if (!options.columns) {
				options.columns = [defaultColumn()];
			}

			await db.ddl.createTable({
				name: options.table,
				columns: options.columns,
			});
		}
	});
}
