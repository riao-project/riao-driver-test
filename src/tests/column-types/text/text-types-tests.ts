import {
	ColumnOptions,
	ColumnType,
	Database,
	not,
	VarCharColumnOptions,
} from '@riao/dbal';

import { TestDependencies } from '../../../dependency-injection';
import { NameColumn } from '@riao/dbal/column-pack';

export type TextColumnTypes = ColumnType &
	(ColumnType.TEXT | ColumnType.CHAR | ColumnType.VARCHAR);

export function textTypesTests(
	di: TestDependencies,
	columnType: TextColumnTypes,
	maxLength: number
) {
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
			const text = genearateRandomString(1);

			await db.query.insert({
				table,
				records: [{ name, text_val: text }],
			});

			const records = await db.query.find({
				table,
				where: { name },
			});

			expect(records.length).toEqual(1);
			expect(records[0].text_val).toEqual(text);
		});

		if (columnType !== ColumnType.CHAR) {
			it('can insert empty string', async () => {
				const name = 'insert_empty_string_test';

				await db.query.insert({
					table,
					records: [{ name, text_val: '' }],
				});

				const records = await db.query.find({
					table,
					where: { name },
				});

				expect(records.length).toEqual(1);
				expect(records[0].text_val.trim()).toEqual('');
			});
		}

		it('can insert long string', async () => {
			const name = 'insert_long_string_test';
			const str = genearateRandomString(maxLength);

			await db.query.insert({
				table,
				records: [{ name, text_val: str }],
			});

			const records = await db.query.find({
				table,
				where: { name },
			});

			expect(records.length).toEqual(1);
			expect(records[0].text_val).toEqual(str);
		});

		it('can insert null value', async () => {
			const name = 'insert_null_test';

			await db.query.insert({
				table,
				records: [{ name, text_val: null }],
			});

			const records = await db.query.find({ table, where: { name } });

			expect(records.length).toEqual(1);
			expect(records[0].text_val).toBeNull();
		});

		it('can query equal', async () => {
			const name = 'query_equal_test';

			await db.query.insert({
				table,
				records: [
					{ name, text_val: 'a' },
					{ name, text_val: 'b' },
				],
			});

			const records = await db.query.find({
				table,
				where: { name, text_val: 'b' },
			});

			expect(records.length).toEqual(1);
			expect(records[0].text_val).toEqual('b');
		});

		it('can query not equal', async () => {
			const name = 'query_not_equal_test';

			await db.query.insert({
				table,
				records: [
					{ name, text_val: 'a' },
					{ name, text_val: 'b' },
				],
			});

			const records = await db.query.find({
				table,
				where: { name, text_val: not('a') },
			});

			expect(records.length).toEqual(1);
			expect(records[0].text_val).toEqual('b');
		});

		it('can default to a value', async () => {
			const value = columnType === ColumnType.CHAR ? 'A' : 'ASDF';
			await defaultValueTest(value, 'value');
		});

		it('can default to null', async () => {
			await defaultValueTest(null, 'null');
		});

		if (columnType !== ColumnType.CHAR) {
			it('can default to empty string', async () => {
				await defaultValueTest('', 'empty_string');
			});
		}

		async function defaultValueTest(
			defaultValue: null | string,
			name: string
		) {
			if (columnType === ColumnType.TEXT) {
				return;
			}

			const table = getTableName('default_' + name);
			const options: Partial<ColumnOptions> = {
				type: columnType,
				name: 'text_val',
				default: defaultValue,
			};

			if (columnType === ColumnType.VARCHAR) {
				(options as VarCharColumnOptions).length = maxLength;
			}

			await createTable({
				table,
				columns: [options as ColumnOptions, NameColumn],
			});

			await db.query.insert({
				table,
				records: [{ name: 'test' }],
			});

			const records = await db.query.find({ table });

			expect(records.length).toEqual(1);
			expect(records[0].text_val).toEqual(defaultValue);
		}

		function getTableName(name: string) {
			return 'columns_text_' + columnType.toLowerCase() + '_' + name;
		}

		function defaultColumn(): ColumnOptions {
			const baseOptions: Partial<ColumnOptions> = {
				type: columnType,
				name: 'text_val',
			};

			if (columnType === ColumnType.VARCHAR) {
				return {
					...baseOptions,
					length: maxLength,
				} as VarCharColumnOptions;
			}
			else {
				return {
					type: columnType,
					name: 'text_val',
				};
			}
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

		function genearateRandomString(length: number): string {
			const startCode = 32;
			const codeRange = 64;
			let str = '';

			for (let i = 0; i < length; i++) {
				str += String.fromCharCode(
					Math.round(Math.random() * codeRange) + startCode
				);
			}

			return str;
		}
	});
}
