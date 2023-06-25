import 'jasmine';
import { ColumnOptions, ColumnType, Database, like } from 'riao-dbal/src';
import { TestDependencies } from '../../dependency-injection';

export const textTest = (di: TestDependencies) =>
	describe('Data Types - Text', () => {
		let db: Database;

		beforeAll(() => {
			db = di.db();
		});

		const textTest = async (
			columnType: ColumnType,
			options: Partial<ColumnOptions>,
			strlen: number
		) => {
			const table = columnType.toLowerCase() + '_column_test';

			const startCode = 32;
			const codeRange = 64;
			let str = '';

			for (let i = 0; i < strlen; i++) {
				str += String.fromCharCode(
					Math.round(Math.random() * codeRange) + startCode
				);
			}

			await db.ddl.createTable({
				name: table,
				columns: [
					{
						type: <any>columnType,
						name: 'text_val',
						...options,
					},
				],
			});

			await db.query.insert({
				table,
				records: { text_val: str },
			});

			let where = {};

			if (columnType === ColumnType.TEXT) {
				where = { text_val: like('%') };
			}
			else {
				where = { text_val: str };
			}

			const records = await db.query.find({
				table,
				where,
			});

			expect(records.length).toEqual(1);
			expect(records[0].text_val).toEqual(str);
		};

		it('supports char column', async () => {
			await textTest(ColumnType.CHAR, {}, 1);
		});

		it('supports varchar column', async () => {
			const length = 8000;
			await textTest(ColumnType.VARCHAR, { length }, length);
		});

		it('supports text column', async () => {
			await textTest(ColumnType.TEXT, {}, 65535);
		});
	});
